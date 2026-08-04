import createPool from '../createPool.js';
import CREATE_TABLE from '../utils/createTable.js';

const mapDepositAmountToNumber = (order) => ({
  ...order,
  deposit_amount: Number(order.deposit_amount),
});

const map = (order) => mapDepositAmountToNumber(order);

class Orders {
  async init(pool) {
    this.pool = pool ?? createPool();

    await this.pool.query(
      `
        ${CREATE_TABLE} orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          customer TEXT NOT NULL,

          product_name TEXT NOT NULL,
          product_photo BYTEA,
          product_description TEXT NOT NULL,

          purchase_price NUMERIC(8, 2) NOT NULL,
          CHECK (purchase_price > 0),
          purchase_currency TEXT NOT NULL,
          CHECK (purchase_currency <> ''),
          purchase_quantity integer NOT NULL,
          CHECK (purchase_quantity > 0),

          deposit_amount bigint NOT NULL,
          deposit_txid TEXT,

          created_at TIMESTAMP NOT NULL DEFAULT now(),
          detected_deposit_at TIMESTAMP,
          confirmed_deposit_at TIMESTAMP
        )
      `,
    );
    await this.pool.query(
      `
        CREATE UNIQUE INDEX
        IF NOT EXISTS orders_deposit_amount_idx
        ON orders (deposit_amount)
        WHERE deposit_txid IS NULL
      `,
    );

    return this;
  }

  async create({
    customer,
    product_name, product_photo, product_description,
    purchase_price, purchase_currency, purchase_quantity,
    deposit_amount,
  }) {
    const result = await this.pool.query(
      `
        INSERT INTO orders(
          customer, 
          product_name, product_photo, product_description,
          purchase_price, purchase_currency, purchase_quantity,
          deposit_amount
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `,
      [
        customer,
        product_name, product_photo, product_description,
        purchase_price, purchase_currency, purchase_quantity,
        deposit_amount,
      ],
    );

    if (result.rowCount !== 1) { throw new Error('Orders.create rowCount !== 1'); }

    return result.rows[0].id;
  }

  async getAllForShop() {
    const { rows } = await this.pool.query(
      `
        SELECT
          id, customer,
          product_name, product_photo,
          purchase_price, purchase_currency, purchase_quantity,
          created_at, detected_deposit_at, confirmed_deposit_at
        FROM orders
        ORDER BY created_at DESC
      `,
    );

    return rows.map(map);
  }

  async getAllForCustomer(customer) {
    const { rows } = await this.pool.query(
      `
        SELECT
          id, 
          product_name, product_photo, 
          purchase_price, purchase_currency, purchase_quantity, 
          created_at, detected_deposit_at, confirmed_deposit_at
        FROM orders
        WHERE customer = $1
        ORDER BY created_at DESC
      `,
      [customer],
    );

    return rows.map(map);
  }

  async get(id) {
    const { rows } = await this.pool.query(
      `
        SELECT
          product_name, product_photo, product_description, 
          purchase_price, purchase_currency, purchase_quantity, 
          deposit_amount, deposit_txid, 
          created_at, detected_deposit_at, confirmed_deposit_at 
        FROM orders
        WHERE id = $1
      `,
      [id],
    );

    const result = rows[0];
    return result && map(result);
  }

  async markDepositDetected({ deposit_amount }) {
    const result = await this.pool.query(
      `
        UPDATE orders
        SET detected_deposit_at = now()
        WHERE deposit_amount = $1 AND detected_deposit_at IS NULL
      `,
      [deposit_amount],
    );

    return result.rowCount !== 1;
  }

  async markDepositConfirmed({ deposit_amount }) {
    const result = await this.pool.query(
      `
        UPDATE orders
        SET confirmed_deposit_at = now()
        WHERE AND deposit_amount = $1 AND confirmed_deposit_at IS NULL
      `,
      [deposit_amount],
    );

    return result.rowCount !== 1;
  }

  async setDepositTxid({ deposit_amount, deposit_txid }) {
    const result = await this.pool.query(
      `
        UPDATE orders
        SET deposit_txid = $2
        WHERE deposit_amount = $1 AND deposit_txid IS NULL
      `,
      [deposit_amount, deposit_txid],
    );

    return result.rowCount !== 1;
  }

  async destroy() {
    await this.pool.end();
  }
}

const createOrders = (...args) => (new Orders()).init(...args);
export default createOrders;
