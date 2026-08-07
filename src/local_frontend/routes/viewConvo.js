import viewConvoPage from '../pages/viewConvoPage.js';
import getConvoAndOrders from '../../backend/utils/getConvoAndOrders.js';
import { MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION } from '../../const.js';

export default async (ctx) => {
  const { backend, params, thumbnailCache } = ctx;
  const { pool } = backend;
  const { id } = params;

  const allExtMessages = (
    await Promise.all( // ???? quering photo from database is excessive here / TODO
      (await getConvoAndOrders({ pool, customer: id })).map(async (extMessage) => ({
        ...extMessage,
        ext_message_payload: {
          ...extMessage.ext_message_payload,
          product_photo: (
            extMessage.ext_message_payload.product_photo
              ? (
                await thumbnailCache.genThumb(
                  `order:${extMessage.id}`,
                  extMessage.ext_message_payload.product_photo,
                  MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION,
                )
              )
              : null
          ),
        },
      })),
    )
  );

  ctx.body = viewConvoPage({
    allExtMessages,
    userId: id,
  });
};
