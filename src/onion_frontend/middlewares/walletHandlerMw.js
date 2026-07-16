import WalletHandler from '../utils/WalletHandler/index.js';
import waitForFile from '../../utils/waitForFile.js';
import { MY_SHOP_WALLET_PATH } from '../../const.js';
import { errorBody, toPublicError } from '../../utils/publicError.js';

export default () => {
  const walletHandler = new WalletHandler();
  waitForFile(MY_SHOP_WALLET_PATH)
    .then(() => walletHandler.init())
    .catch((error) => {
      console.error(error);
      walletHandler.lastError = errorBody(toPublicError(error, {
        code: 'wallet_start_failed',
        message: 'The Monero wallet could not start. Check the wallet file and node connection.',
      })).error;
    });

  return async (ctx, next) => {
    ctx.walletHandler = walletHandler;

    await next();
  };
};
