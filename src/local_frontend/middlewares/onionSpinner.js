import OnionSpinner from '../utils/OnionSpinner/index.js';

export default () => {
  const onionSpinner = new OnionSpinner();

  return async (ctx, next) => {
    ctx.onionSpinner = onionSpinner;

    await next();
  };
};
