import convoPage from '../pages/convoPage.js';
import getConvoAndOrders from '../../backend/utils/getConvoAndOrders.js';
import { MY_SHOP_PRODUCT_THUMB_SIZE } from '../../const.js';

export default async (ctx) => {
  const { state, backend, thumbnailCache } = ctx;
  const { pool, orders } = backend;
  const { userId } = state.user;

  const allExtMessages = (
    await Promise.all(
      (await getConvoAndOrders({ pool, customer: userId })).map(async (extMessage) => ({
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

  ctx.body = convoPage({
    allExtMessages,
    userId,
  });
};
