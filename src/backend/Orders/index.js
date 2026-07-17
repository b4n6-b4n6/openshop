import createPool from '../createPool.js';
import CREATE_TABLE from '../utils/createTable.js';

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

          purchase_price NUMERIC(5, 2) NOT NULL,
          purchase_currency TEXT NOT NULL,
          purchase_quantity integer NOT NULL,

          deposit_address TEXT UNIQUE NOT NULL,
          deposit_amount bigint NOT NULL,
          deposit_txid TEXT,

          created_at TIMESTAMP NOT NULL DEFAULT now(),
          detected_deposit_at TIMESTAMP,
          confirmed_deposit_at TIMESTAMP
        )
      `,
    );

    return this;
  }

  async create({
    customer,
    product_name, product_photo, product_description,
    purchase_price, purchase_currency, purchase_quantity,
    deposit_address, deposit_amount,
  }) {
    const result = await this.pool.query(
      `
        INSERT INTO orders(
          customer, 
          product_name, product_photo, product_description,
          purchase_price, purchase_currency, purchase_quantity,
          deposit_address, deposit_amount
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `,
      [
        customer,
        product_name, product_photo, product_description,
        purchase_price, purchase_currency, purchase_quantity,
        deposit_address, deposit_amount,
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
        ORDER BY created_at
      `,
    );

    return rows;
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
        ORDER BY created_at
      `,
      [customer],
    );

    return rows;
  }

  async get(id) {
    const { rows } = await this.pool.query(
      `
        SELECT
          product_name, product_photo, product_description, 
          purchase_price, purchase_currency, purchase_quantity, 
          deposit_address, deposit_amount, deposit_txid, 
          created_at, detected_deposit_at, confirmed_deposit_at 
        FROM orders
        WHERE id = $1
      `,
      [id],
    );

    return rows[0];
  }

  async markDepositDetected({ deposit_address, deposit_amount }) {
    const result = await this.pool.query(
      `
        UPDATE orders
        SET detected_deposit_at = now()
        WHERE deposit_address = $1 AND deposit_amount = $2 AND detected_deposit_at IS NULL
      `,
      [deposit_address, deposit_amount],
    );

    return result.rowCount !== 1;
  }

  async markDepositConfirmed({ deposit_address, deposit_amount }) {
    const result = await this.pool.query(
      `
        UPDATE orders
        SET confirmed_deposit_at = now()
        WHERE deposit_address = $1 AND deposit_amount = $2 AND confirmed_deposit_at IS NULL
      `,
      [deposit_address, deposit_amount],
    );

    return result.rowCount !== 1;
  }

  async setDepositTxid({ deposit_address, deposit_amount, txid }) {
    const result = await this.pool.query(
      `
        UPDATE orders
        SET deposit_txid = $3
        WHERE deposit_address = $1 AND deposit_amount = $2 AND deposit_txid IS NULL
      `,
      [deposit_address, deposit_amount, txid],
    );

    if (result.rowCount !== 1) { throw new Error('Orders.setDepositTxid rowCount !== 1'); }
  }

  async destroy() {
    await this.pool.end();
  }
}

const createOrders = (...args) => (new Orders()).init(...args);
export default createOrders;
