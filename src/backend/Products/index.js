import createPool from '../createPool.js';
import CREATE_TABLE from '../utils/createTable.js';

class Products {
  async init(pool) {
    this.pool = pool ?? createPool();

    await this.pool.query(
      `
        ${CREATE_TABLE} products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

          name TEXT NOT NULL,
          photo BYTEA,
          description TEXT NOT NULL,

          price NUMERIC(5, 2) NOT NULL,
          currency TEXT NOT NULL,
          CHECK (currency <> ''),

          available_quantity integer NOT NULL
        )
      `,
    );

    return this;
  }

  async create({
    name, photo, description, price, currency, available_quantity,
  }) {
    const result = await this.pool.query(
      `
        INSERT INTO products(name, photo, description, price, currency, available_quantity)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING id
      `,
      [name, photo, description, price, currency, available_quantity],
    );
    if (result.rowCount !== 1) { throw new Error('Products.create rowCount !== 1'); }

    return result.rows[0].id;
  }

  async update({
    id, name, photo, description, price, currency, available_quantity,
  }) {
    const result = await this.pool.query(
      `
        UPDATE products
        SET
          name = $2,
          photo = COALESCE($3, photo),
          description = $4,
          price = $5,
          currency = $6,
          available_quantity = $7
        WHERE id = $1
      `,
      [id, name, photo, description, price, currency, available_quantity],
    );

    if (result.rowCount !== 1) { throw new Error('Products.update rowCount !== 1'); }
  }

  async getAll() {
    const { rows } = await this.pool.query(
      `
        SELECT id, name, photo, price, currency, available_quantity
        FROM products
        ORDER BY name
      `,
    );

    return rows;
  }

  async get(id) {
    const { rows } = await this.pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id],
    );

    return rows[0];
  }

  async destroy() {
    await this.pool.end();
  }
}

const createProducts = (...args) => (new Products()).init(...args);
export default createProducts;
