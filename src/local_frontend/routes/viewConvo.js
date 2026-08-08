import viewConvoPage from '../pages/viewConvoPage.js';
import getConvoAndOrders from '../../backend/utils/getConvoAndOrders.js';
import { MY_SHOP_PRODUCT_THUMB_SIZE } from '../../const.js';

export default async (ctx) => {
  const { backend, params, thumbnailCache } = ctx;
  const { pool, orders } = backend;
  const { id } = params;

  const allExtMessages = (
    await Promise.all(
      (await getConvoAndOrders({ pool, customer: id })).map(async (extMessage) => ({
        ...extMessage,
        ext_message_payload: {
          ...extMessage.ext_message_payload,
          product_photo: (
            extMessage.ext_message_payload.product_photo_exists
              ? (
                await thumbnailCache.genThumb(
                  `order:${extMessage.id}`,
                  () => orders.getProductPhoto(extMessage.id),
                  MY_SHOP_PRODUCT_THUMB_SIZE,
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
