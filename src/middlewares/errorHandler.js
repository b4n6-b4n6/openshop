import { errorBody, toPublicError } from '../utils/publicError.js';
import {
  appFrame,
  document,
  errorNotice,
} from '../shared/pages/layout.js';

export default () => async (ctx, next) => {
  try {
    await next();

    if (ctx.status === 404 && !ctx.body) {
      ctx.throw(
        404,
        ctx.path.startsWith('/api/') ? 'API route not found' : 'Page not found',
        { code: 'not_found' },
      );
    }
  } catch (error) {
    const publicError = toPublicError(error);

    if (publicError.status >= 500) {
      console.error(`[${ctx.method} ${ctx.path}]`, error);
    } else {
      console.warn(
        `[${ctx.method} ${ctx.path}] ${publicError.code}: ${publicError.message}`,
      );
    }
    ctx.status = publicError.status;
    const wantsJson = ctx.path.startsWith('/api/')
      || ctx.get('accept').includes('application/json');
    if (wantsJson) {
      ctx.type = 'application/json';
      ctx.body = errorBody(publicError);
    } else {
      ctx.type = 'text/html; charset=utf-8';
      ctx.body = document({
        title: 'Error',
        body: appFrame({
          title: 'Error',
          back: '/',
          content: errorNotice(publicError.message),
        }),
      });
    }
  }
};
