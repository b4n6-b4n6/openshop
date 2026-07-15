import createPool from '../createPool.js';
import CREATE_TABLE from '../utils/createTable.js';

class Shops {
  async init(pool) {
    this.pool = pool ?? createPool();

    await this.pool.query(
      `
        ${CREATE_TABLE} shops (
          address TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          profile_photo BYTEA,
          banner_photo BYTEA
        )
      `,
    );

    return this;
  }

  async update({
    address, name, description, profile_photo, banner_photo,
  }) {
    const result = await this.pool.query(
      `
        MERGE INTO shops AS shop
        USING (VALUES($1, $2, $3, $4::bytea, $5::bytea))
        AS updated_shop (address, name, description, profile_photo, banner_photo)
        ON shop.address = updated_shop.address
        WHEN MATCHED THEN
          UPDATE SET
            name = updated_shop.name,
            description = updated_shop.description,
            profile_photo = COALESCE(updated_shop.profile_photo, shop.profile_photo),
            banner_photo = COALESCE(updated_shop.banner_photo, shop.banner_photo)
        WHEN NOT MATCHED THEN
          INSERT (address, name, description, profile_photo, banner_photo)
          VALUES (
            updated_shop.address,
            updated_shop.name,
            updated_shop.description,
            updated_shop.profile_photo,
            updated_shop.banner_photo
          )
        ;
      `,
      [address, name, description, profile_photo, banner_photo],
    );

    if (result.rowCount !== 1) { throw new Error('Shops.update rowCount !== 1'); }
  }

  async get(address) {
    const { rows } = await this.pool.query(
      'SELECT * FROM shops WHERE address = $1',
      [address],
    );

    return rows[0];
  }

  async destroy() {
    await this.pool.end();
  }
}

const createShops = (...args) => (new Shops()).init(...args);
export default createShops;
