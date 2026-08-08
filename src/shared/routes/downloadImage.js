/* eslint-disable import/no-unresolved */
import { fileTypeFromBuffer } from 'file-type';

export default async (ctx) => {
  const { backend, params } = ctx;
  const { messages } = backend;
  const { id } = params;

  const imageContent = await messages.getImageContent(id);
  if (!imageContent) {
    ctx.body = '';
    return;
  }

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
