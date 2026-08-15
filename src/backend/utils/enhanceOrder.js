import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import { THUMB_CACHE_KEY, THUMB_CACHE_SIZE } from '../../const.js';

export default async ({ order, orders, thumbCache }) => ({
  ...order,
  product_photo: bufferToImageDataURI(
    order.product_photo_exists
      ? await thumbCache.genThumb(
        `${THUMB_CACHE_KEY.ORDER}:${order.id}`,
        () => orders.getPhoto(order.id),
        THUMB_CACHE_SIZE.ORDER,
      )
      : null,
  ),
});
