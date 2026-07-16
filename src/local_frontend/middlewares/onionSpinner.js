import OnionSpinner from '../utils/OnionSpinner/index.js';

export default () => {
  const onionSpinner = new OnionSpinner();

  return async (ctx, next) => {
    ctx.onionSpinner = onionSpinner;

    if (ctx.walletSetup?.completed
      && !onionSpinner.onion
      && !onionSpinner.spinning
      && !onionSpinner.lastError) {
      onionSpinner.spinUp();
    }

    await next();
  };
};
