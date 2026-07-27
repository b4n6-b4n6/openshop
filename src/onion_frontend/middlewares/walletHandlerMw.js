import WalletHandler from '../utils/WalletHandler/index.js';

export default () => {
  const walletHandler = new WalletHandler();

  return async (ctx, next) => {
    ctx.walletHandler = walletHandler;

    await next();
  };
};
