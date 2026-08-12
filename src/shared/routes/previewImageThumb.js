/* eslint-disable import/no-unresolved */
import { fileTypeFromBuffer } from 'file-type';
import { CACHE_CONTROL_FOREVER, CONVO_IMAGE_PREVIEW_SIZE } from '../../const.js';

export default async (ctx) => {
  const { backend, params, thumbnailCache } = ctx;
  const { messages } = backend;
  const { id } = params;

  const imageContentExists = await messages.getImageContentExists(id);
  if (!imageContentExists) {
    ctx.body = '';
    return;
  }

  const thumbContent = (
    await thumbnailCache.genThumb(
      `message-preview:${id}`,
      () => messages.getImageContent(id),
      CONVO_IMAGE_PREVIEW_SIZE,
    )
  );

  const fileType = await fileTypeFromBuffer(thumbContent);
  if (!fileType) {
    ctx.throw(415, 'Unsupported image type');
    return;
  }

  ctx.set('Content-Length', thumbContent.length);
  ctx.type = fileType.mime;
  ctx.set('Content-Disposition', 'inline');
  ctx.set('Cache-Control', CACHE_CONTROL_FOREVER);

  ctx.body = thumbContent;
};
