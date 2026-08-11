/* eslint-disable import/no-unresolved */
import { fileTypeFromBuffer } from 'file-type';
import { CACHE_CONTROL_DIRECTIVE } from '../../const.js';

export default async (ctx) => {
  const { backend, params, imageHashCache } = ctx;
  const { messages } = backend;
  const { id } = params;
  let imageContent;

  let version = await imageHashCache.get(id);
  if (!version) {
    imageContent = await messages.getImageContent(id);

    if (!imageContent) {
      ctx.body = '';
      return;
    }

    version = await imageHashCache.genDigest(
      id,
      imageContent,
    );
  }

  ctx.set('ETag', `"${version}"`);
  if (ctx.get('if-none-match') === `"${version}"`) {
    ctx.status = 304;
    return;
  }
  ctx.set('Cache-Control', CACHE_CONTROL_DIRECTIVE);

  if (!imageContent) { imageContent = await messages.getImageContent(id); }

  const fileType = await fileTypeFromBuffer(imageContent);
  if (!fileType) {
    ctx.throw(415, 'Unsupported image type');
    return;
  }
  const filename = `${id}.${fileType.ext}`;

  ctx.set('Content-Length', imageContent.length);
  ctx.type = fileType.mime;
  if (ctx.query.inline === '1') {
    ctx.set('Content-Disposition', `inline; filename="${filename}"`);
  } else {
    ctx.attachment(filename);
  }
  ctx.body = imageContent;
};
