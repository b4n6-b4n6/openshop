/* eslint-disable camelcase */
import createPool from '../createPool.js';
import CREATE_TABLE from '../utils/createTable.js';

class Messages {
  async init(pool) {
    this.pool = pool ?? createPool();

    await this.pool.query(
      `
        ${CREATE_TABLE} messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

          sender TEXT NOT NULL,
          receiver TEXT NOT NULL,

          image_content BYTEA,
          text_content TEXT,
          check ((image_content is null) != (text_content is null)),

          created_at TIMESTAMP NOT NULL DEFAULT now(),
          received_at TIMESTAMP,
          read_at TIMESTAMP
        )
      `,
    );

    return this;
  }

  async create({
    image_content, text_content, sender, receiver,
  }) {
    const result = await this.pool.query(
      `
        INSERT INTO messages(image_content, text_content, sender, receiver)
        VALUES($1, $2, $3, $4)
      `,
      [image_content, text_content, sender, receiver],
    );

    if (result.rowCount !== 1) { throw new Error('Messages.create rowCount !== 1'); }
  }

  async getConvo({ shop_address, customer_id }) {
    const { rows } = await this.pool.query(
      `
        SELECT id, sender, receiver, text_content, created_at
        FROM messages
        WHERE (sender = $1 OR receiver = $1) AND (sender = $2 OR receiver = $2)
        ORDER BY created_at
      `,
      [shop_address, customer_id],
    );

    return rows;
  }

  async getImageContent(id) {
    const { rows } = await this.pool.query(
      'SELECT image_content FROM messages WHERE id = $1',
      [id],
    );

    return rows[0]?.image_content;
  }

  /* ...
  async markAllReceivedInConvo() {}
  async markAllReadInConvo() {}
  ... */

  async destroy() {
    await this.pool.end();
  }
}

const createMessages = (...args) => (new Messages()).init(...args);
export default createMessages;
