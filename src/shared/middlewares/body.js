/* eslint-disable no-param-reassign */
import { PassThrough } from 'node:stream';
import consumers from 'node:stream/consumers';
import compose from 'koa-compose';
import { koaBody } from 'koa-body';
import {
  UPLOAD_FILE_MAX_SIZE,
  UPLOAD_FORM_MAX_SIZE,
} from '../../const.js';

export default () => compose([
  koaBody({
    formidable: {
      fileWriteStreamHandler: (file) => {
        const stream = new PassThrough();

        file.bufferPromise = consumers.buffer(stream).then((buffer) => {
          file.buffer = buffer;
        });

        return stream;
      },
      maxFileSize: UPLOAD_FILE_MAX_SIZE,
      allowEmptyFiles: true,
      minFileSize: 0,
    },
    multipart: true,
    formLimit: UPLOAD_FORM_MAX_SIZE,
    textLimit: 0,
    jsonLimit: 0,
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
