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
          deposit_detected_at TIMESTAMP,
          deposit_confirmed_at TIMESTAMP,
          expired_at TIMESTAMP
        )
      `,
    );
    await this.pool.query(
      `
        CREATE UNIQUE INDEX
        IF NOT EXISTS orders_deposit_amount_idx
        ON orders (deposit_amount)
        WHERE deposit_txid IS NULL OR expired_at IS NULL
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
          product_name, product_photo IS NOT NULL AS product_photo_exists,
          purchase_price, purchase_currency, purchase_quantity,
          deposit_amount, deposit_txid,
          created_at, deposit_detected_at, deposit_confirmed_at, expired_at
        FROM orders
        ORDER BY created_at DESC
      `,
    );

    return rows.map(map);
  }

  async getAllNotifiableForShop() {
    const { rows } = await this.pool.query(
      `
        SELECT id, deposit_detected_at, deposit_confirmed_at
        FROM orders
        WHERE deposit_detected_at IS NOT NULL
        ORDER BY created_at DESC
      `,
    );

    return rows;
  }

  async getAllForCustomer(customer) {
    const { rows } = await this.pool.query(
      `
        SELECT
          id, 
          product_name, product_photo IS NOT NULL AS product_photo_exists, 
          purchase_price, purchase_currency, purchase_quantity, 
          deposit_amount, deposit_txid,
          created_at, deposit_detected_at, deposit_confirmed_at, expired_at
        FROM orders
        WHERE customer = $1
        ORDER BY created_at DESC
      `,
      [customer],
    );

    return rows.map(map);
  }

  async getPhoto(id) {
    const { rows } = await this.pool.query(
      'SELECT product_photo FROM orders WHERE id = $1',
      [id],
    );

    return rows[0]?.product_photo;
  }

  async getAllForCustomerAsExtMessages(customer) {
    const { rows } = await this.pool.query(
      `
        SELECT
          id,
          created_at AS ext_message_occured_at,
          'ORDER_CREATED' AS ext_message_type,
          jsonb_build_object(
            'product_name', product_name,
            'product_photo_exists', product_photo IS NOT NULL,
            'purchase_price', purchase_price,
            'purchase_currency', purchase_currency,
            'purchase_quantity', purchase_quantity
          ) AS ext_message_payload
        FROM orders
        WHERE customer = $1

        UNION ALL

        SELECT
          id,
          deposit_detected_at AS ext_message_occured_at,
          'ORDER_DEPOSIT_DETECTED' as ext_message_type,
          jsonb_build_object(
            'product_name', product_name,
            'product_photo_exists', product_photo IS NOT NULL,
            'purchase_price', purchase_price,
            'purchase_currency', purchase_currency,
            'purchase_quantity', purchase_quantity
          ) AS ext_message_payload
        FROM orders
        WHERE customer = $1 AND deposit_detected_at IS NOT NULL

        UNION ALL

        SELECT
          id,
          deposit_confirmed_at AS ext_message_occured_at,
          'ORDER_DEPOSIT_CONFIRMED' as ext_message_type,
          jsonb_build_object(
            'product_name', product_name,
            'product_photo_exists', product_photo IS NOT NULL,
            'purchase_price', purchase_price,
            'purchase_currency', purchase_currency,
            'purchase_quantity', purchase_quantity
          ) AS ext_message_payload
        FROM orders
        WHERE customer = $1 AND deposit_confirmed_at IS NOT NULL

        UNION ALL

        SELECT
          id,
          expired_at AS ext_message_occured_at,
          'ORDER_EXPIRED' as ext_message_type,
          jsonb_build_object(
            'product_name', product_name,
            'product_photo_exists', product_photo IS NOT NULL,
            'purchase_price', purchase_price,
            'purchase_currency', purchase_currency,
            'purchase_quantity', purchase_quantity
          ) AS ext_message_payload
        FROM orders
        WHERE customer = $1 AND expired_at IS NOT NULL

        ORDER BY ext_message_occured_at;
      `,
      [customer],
    );

    return rows;
  }

  async get(id) {
    const { rows } = await this.pool.query(
      `
        SELECT
          id,
          customer,
          
          product_name,
          product_photo IS NOT NULL AS product_photo_exists,
          product_description,
          
          purchase_price, purchase_currency, purchase_quantity, 
          deposit_amount, deposit_txid, 
          
          created_at,
          deposit_detected_at,
          deposit_confirmed_at,
          expired_at
        FROM orders
        WHERE id = $1
      `,
      [id],
    );

    const result = rows[0];
    return result && map(result);
  }

  async expireOld(maxAge) {
    const result = await this.pool.query(
      `
        UPDATE orders
        SET expired_at = now()
        WHERE
          deposit_detected_at IS NULL AND
          deposit_confirmed_at IS NULL AND
          deposit_txid IS NULL AND
          expired_at IS NULL AND
          created_at < NOW() - ($1 * INTERVAL '1 minute')
      `,
      [maxAge],
    );

    return result.rowCount;
  }

  async markDepositDetected({ deposit_amount }) {
    const result = await this.pool.query(
      `
        UPDATE orders
        SET deposit_detected_at = now()
        WHERE
          deposit_amount = $1 AND
          deposit_detected_at IS NULL AND
          expired_at IS NULL
      `,
      [deposit_amount],
    );

    return result.rowCount === 1;
  }

  async markDepositConfirmed({ deposit_amount }) {
    const result = await this.pool.query(
      `
        UPDATE orders
        SET deposit_confirmed_at = now()
        WHERE
          deposit_amount = $1 AND
          deposit_confirmed_at IS NULL AND
          expired_at IS NULL
      `,
      [deposit_amount],
    );

    return result.rowCount === 1;
  }

  async setDepositTxid({ deposit_amount, deposit_txid }) {
    const result = await this.pool.query(
      `
        UPDATE orders
        SET deposit_txid = $2
        WHERE
          deposit_amount = $1 AND
          deposit_txid IS NULL AND
          expired_at IS NULL
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
