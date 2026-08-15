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

    if (payload.image_content_exists) {
      if (own) {
        const preview = await thumbCache.genThumb(
          `${THUMB_CACHE_KEY.MESSAGE}:${event.id}`,
          () => messages.getImageContent(event.id),
          THUMB_CACHE_SIZE.MESSAGE,
        );

        return {
          ...event,
          ext_message_payload: {
            ...payload,
            image_preview: bufferToImageDataURI(preview),
          },
        };
      } else {
        const preview = await thumbCache.genThumb(
          `${THUMB_CACHE_KEY.MESSAGE_BLUR}:${event.id}`,
          () => messages.getImageContent(event.id),
          THUMB_CACHE_SIZE.MESSAGE_BLUR,
        );

        return {
          ...event,
          ext_message_payload: {
            ...payload,
            image_blur_preview: bufferToImageDataURI(preview),
          },
        };
      }
    } else if (payload.product_photo_exists) {
      const photo = await thumbCache.genThumb(
        `${THUMB_CACHE_KEY.ORDER}:${event.id}`,
        () => orders.getPhoto(event.id),
        THUMB_CACHE_SIZE.ORDER,
      );

      return {
        ...event,
        ext_message_payload: {
          ...payload,
          product_photo: await bufferToImageDataURI(photo),
        },
      };
    }

    return event;
  }))
);
