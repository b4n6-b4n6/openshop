import {
  CONVO_IMAGE_PREVIEW_SIZE,
  MY_SHOP_PRODUCT_THUMB_SIZE,
} from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';

const CONVO_IMAGE_PREVIEW_BLUR_SIZE = [24, 15];

export default async ({
  backend, thumbnailCache, allExtMessages, me,
}) => (
  Promise.all(allExtMessages.map(async (event) => {
    const payload = event.ext_message_payload;
    const own = payload.sender === me;

    if (payload.image_content_exists) {
      if (own) {
        const preview = await thumbnailCache.genThumb(
          `message-preview:${event.id}`,
          () => backend.messages.getImageContent(event.id),
          CONVO_IMAGE_PREVIEW_SIZE,
        );

        return {
          ...event,
          ext_message_payload: {
            ...payload,
            image_preview: bufferToImageDataURI(preview),
          },
        };
      }
      const preview = await thumbnailCache.genThumb(
        `message-preview-blur:${event.id}`,
        () => backend.messages.getImageContent(event.id),
        CONVO_IMAGE_PREVIEW_BLUR_SIZE,
      );

      return {
        ...event,
        ext_message_payload: {
          ...payload,
          image_blur_preview: bufferToImageDataURI(preview),
        },
      };
    } if (payload.product_photo_exists) {
      const photo = await thumbnailCache.genThumb(
        `order:${event.id}`,
        () => backend.orders.getPhoto(event.id),
        MY_SHOP_PRODUCT_THUMB_SIZE,
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
