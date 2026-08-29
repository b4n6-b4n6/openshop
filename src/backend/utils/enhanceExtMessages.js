import { THUMB_CACHE_KEY, THUMB_CACHE_SIZE } from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';

export default async ({
  allExtMessages,
  messages,
  orders,
  thumbCache,
  me,
}) => (
  Promise.all(allExtMessages.map(async (event) => {
    const payload = event.ext_message_payload;
    const own = payload.sender === me;

    return {
      ...event,
      ext_message_payload: {
        ...payload,
        ...(payload.image_content_exists && own ? {
          image_preview: bufferToImageDataURI(
            await thumbCache.genThumb(
              `${THUMB_CACHE_KEY.MESSAGE}:${event.id}`,
              () => messages.getImageContent(event.id),
              THUMB_CACHE_SIZE.MESSAGE,
            ),
          ),
        } : {}),
        ...(payload.image_content_exists && !own ? {
          image_blur_preview: bufferToImageDataURI(
            await thumbCache.genThumb(
              `${THUMB_CACHE_KEY.MESSAGE_BLUR}:${event.id}`,
              () => messages.getImageContent(event.id),
              THUMB_CACHE_SIZE.MESSAGE_BLUR,
            ),
          ),
        } : {}),
        ...(payload.product_photo_exists ? {
          product_photo: bufferToImageDataURI(
            await thumbCache.genThumb(
              `${THUMB_CACHE_KEY.ORDER}:${event.id}`,
              () => orders.getPhoto(event.id),
              THUMB_CACHE_SIZE.ORDER,
            ),
          ),
        } : {}),
      },
    };
  }))
);
