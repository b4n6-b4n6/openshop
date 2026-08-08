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
          CHECK ((image_content is null) != (text_content is null)),

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

  async getConvo(parties) {
    if (parties.length !== 2) { throw new Error('Messages.getConvo parties.length !== 2'); }

    const { rows } = await this.pool.query(
      `
        SELECT
          id, sender, receiver,
          image_content IS NOT NULL AS image_content_exists,
          text_content, created_at, received_at, read_at
        FROM messages
        WHERE (sender = $1 OR receiver = $1) AND (sender = $2 OR receiver = $2)
        ORDER BY created_at
      `,
      parties,
    );

    return rows;
  }

  async getConvos(party) {
    const { rows } = await this.pool.query(
      `
        SELECT
          CASE WHEN sender = $1 THEN receiver ELSE sender END AS id,
          MAX(created_at) AS last_message_at,
          (ARRAY_AGG(sender ORDER BY created_at DESC))[1] AS last_message_sender,
          BOOL_OR(read_at IS NULL) FILTER (WHERE receiver = $1) AS unread
        FROM messages
        WHERE sender = $1 OR receiver = $1
        GROUP BY CASE WHEN sender = $1 THEN receiver ELSE sender END
        ORDER BY last_message_at DESC
      `,
      [party],
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

  async getNotificationState(party) {
    const { rows } = await this.pool.query(
      `
        SELECT
          (
            SELECT id
            FROM messages
            WHERE receiver = $1
            ORDER BY created_at DESC, id DESC
            LIMIT 1
          ) AS latest_incoming_id,
          ARRAY(
            SELECT DISTINCT sender
            FROM messages
            WHERE receiver = $1 AND read_at IS NULL
            ORDER BY sender
          ) AS unread_chat_ids
      `,
      [party],
    );

    return {
      latestIncomingId: rows[0].latest_incoming_id,
      unreadChatIds: rows[0].unread_chat_ids,
    };
  }

  async markAllReceivedInConvo({ sender, receiver }) {
    await this.pool.query(
      `
        UPDATE messages
        SET received_at = COALESCE(received_at, now())
        WHERE sender = $1 AND receiver = $2 AND received_at IS NULL
      `,
      [sender, receiver],
    );
  }

  async markAllReadInConvo({ sender, receiver }) {
    await this.pool.query(
      `
        UPDATE messages
        SET
          received_at = COALESCE(received_at, now()),
          read_at = COALESCE(read_at, now())
        WHERE sender = $1 AND receiver = $2
      `,
      [sender, receiver],
    );
  }

  async destroy() {
    await this.pool.end();
  }
}

const createMessages = (...args) => (new Messages()).init(...args);
export default createMessages;
