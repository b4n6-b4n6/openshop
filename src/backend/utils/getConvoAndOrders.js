import isTest from '../../utils/isTest.js';

const getConvoAndOrders = async ({ pool, customer }) => {
  const { rows } = await pool.query(
    `
      SELECT
        id,
        created_at AS ext_message_occured_at,
        'NEW_ORDER_CREATED' AS ext_message_event_type,
        jsonb_build_object(
          'product_name', product_name,
          'product_photo', product_photo,
          'purchase_price', purchase_price::text,
          'purchase_currency', purchase_currency,
          'purchase_quantity', purchase_quantity
        ) AS ext_message_payload
      FROM orders
      WHERE customer = $1

      UNION ALL

      SELECT
        id,
        deposit_detected_at AS ext_message_occured_at,
        'ORDER_DEPOSIT_DETECTED' as ext_message_event_type,
        jsonb_build_object(
          'product_name', product_name,
          'product_photo', product_photo,
          'purchase_price', purchase_price::text,
          'purchase_currency', purchase_currency,
          'purchase_quantity', purchase_quantity
        ) AS ext_message_payload
      FROM orders
      WHERE customer = $1 AND deposit_detected_at IS NOT NULL

      UNION ALL

      SELECT
        id,
        deposit_confirmed_at AS ext_message_occured_at,
        'ORDER_DEPOSIT_CONFIRMED' as ext_message_event_type,
        jsonb_build_object(
          'product_name', product_name,
          'product_photo', product_photo,
          'purchase_price', purchase_price::text,
          'purchase_currency', purchase_currency,
          'purchase_quantity', purchase_quantity
        ) AS ext_message_payload
      FROM orders
      WHERE customer = $1 AND deposit_confirmed_at IS NOT NULL

      UNION ALL

      SELECT
        id,
        created_at AS ext_message_occured_at,
        'CONVO_MESSAGE' as ext_message_event_type,
        jsonb_build_object(
          'sender', sender,
          'receiver', receiver,
          'text_content', text_content,
          'created_at', created_at,
          'received_at', received_at,
          'read_at', read_at
        ) AS ext_message_payload
      FROM messages
      WHERE sender = $1 OR receiver = $1

      ORDER BY ext_message_occured_at DESC;
    `,
    [customer],
  );

  return rows;
};

export default getConvoAndOrders;
