/* eslint-disable camelcase */

import createPool from '../createPool.js';
import CREATE_TABLE from '../utils/createTable.js';

class Shops {
  async init(pool) {
    this.pool = pool ?? createPool();

    await this.pool.query(
      `
        ${CREATE_TABLE} shops (
          address text primary key,
          profile_photo bytea,
          banner_photo bytea,
          name text not null,
          description text not null
        )
      `,
    );

    return this;
  }

  async update({
    address, profile_photo, banner_photo, name, description,
  }) {
    const result = await this.pool.query(
      `
        INSERT INTO shops(address, profile_photo, banner_photo, name, description)
        VALUES($1, $2, $3, $4, $5)
        ON CONFLICT (address)
        DO UPDATE SET
          profile_photo = EXCLUDED.profile_photo,
          banner_photo = EXCLUDED.banner_photo,
          name = EXCLUDED.name,
          description = EXCLUDED.description
      `,
      [address, profile_photo, banner_photo, name, description],
    );
    if (result.rowCount !== 1) { throw new Error('Users.create rowCount !== 1'); }
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
