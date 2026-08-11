import { MY_SHOP_PRODUCT_THUMB_SIZE } from '../../const.js';
import getConvoAndOrders from '../../backend/utils/getConvoAndOrders.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import { chatVersion } from '../utils/viewVersions.js';

const CONVO_IMAGE_PREVIEW_SIZE = 16;

export default async ({ backend, customer, thumbnailCache }) => {
  const { pool, messages, orders } = backend;
  const events = await getConvoAndOrders({ pool, customer });
  const version = chatVersion(events);
  const allExtMessages = await Promise.all(events.map(async (event) => {
    const payload = event.ext_message_payload;
    if (payload.image_content_exists) {
      const preview = await thumbnailCache.genThumb(
        `message-preview:${event.id}`,
        () => messages.getImageContent(event.id),
        CONVO_IMAGE_PREVIEW_SIZE,
      );

      return {
        ...event,
        ext_message_payload: {
          ...payload,
          image_blur_preview: bufferToImageDataURI(preview),
        },
      };
    }
    if (!payload.product_photo_exists) return event;

    const photo = await thumbnailCache.genThumb(
      `order:${event.id}`,
      () => orders.getPhoto(event.id),
      MY_SHOP_PRODUCT_THUMB_SIZE,
    );

    return {
      ...event,
      ext_message_payload: {
        ...payload,
        product_photo: await bufferToImageDataURI(photo),
      },
    };
  }));

  return { allExtMessages, version };
};
