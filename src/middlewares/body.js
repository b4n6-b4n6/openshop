/* eslint-disable import/no-unresolved */
/* eslint-disable no-param-reassign */
import { PassThrough } from 'node:stream';
import { getStreamAsBuffer } from 'get-stream';
import compose from 'koa-compose';
import { koaBody } from 'koa-body';

export default () => compose([
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 20 * 1024 * 1024,
      fileWriteStreamHandler: (file) => {
        const stream = new PassThrough();

        file.bufferPromise = getStreamAsBuffer(stream).then((buffer) => {
          file.buffer = buffer;
        });

        return stream;
      },
      allowEmptyFiles: true,
      minFileSize: 0,
    },
  }),
  async (ctx, next) => {
    const { files } = ctx.request;

    if (files) {
      Object.entries(files).forEach(([k, v]) => {
        if (!Array.isArray(v)) {
          files[k] = [v];
        }
      });

      await Promise.all(
        []
          .concat(...Object.values(ctx.request.files))
          .map((file) => file.bufferPromise),
      );

      Object.entries(files).forEach(([k, v]) => {
        files[k] = v.filter((file) => file.size);
      });
    }

    await next();
  },
]);
