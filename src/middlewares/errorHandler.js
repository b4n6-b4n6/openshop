import { errorBody, toPublicError } from '../utils/publicError.js';

export default () => async (ctx, next) => {
  try {
    await next();

    if (ctx.status === 404 && ctx.path.startsWith('/api/')) {
      ctx.throw(404, 'API route not found', { code: 'not_found' });
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
    ctx.type = 'application/json';
    ctx.body = errorBody(publicError);
  }
};
