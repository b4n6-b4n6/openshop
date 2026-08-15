const getExtMessages = async ({ pool, customer }) => {
  const { rows } = await pool.query(
    `
      SELECT
        id,
        created_at AS ext_message_occured_at,
        'NEW_ORDER_CREATED' AS ext_message_type,
        jsonb_build_object(
          'product_name', product_name,
          'product_photo_exists', product_photo IS NOT NULL,
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
        'ORDER_DEPOSIT_DETECTED' as ext_message_type,
        jsonb_build_object(
          'product_name', product_name,
          'product_photo_exists', product_photo IS NOT NULL,
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
        'ORDER_DEPOSIT_CONFIRMED' as ext_message_type,
        jsonb_build_object(
          'product_name', product_name,
          'product_photo_exists', product_photo IS NOT NULL,
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
        'CONVO' as ext_message_type,
        jsonb_build_object(
          'sender', sender,
          'receiver', receiver,
          'image_content_exists', image_content IS NOT NULL,
          'text_content', text_content,
          'created_at', created_at,
          'received_at', received_at,
          'read_at', read_at
        ) AS ext_message_payload
      FROM messages
      WHERE sender = $1 OR receiver = $1

      ORDER BY ext_message_occured_at;
    `,
    [customer],
  );

  return rows;
};

export default getExtMessages;
