import WalletHandler from '../utils/WalletHandler/index.js';
import waitForFile from '../../utils/waitForFile.js';
import { MY_SHOP_WALLET_PATH } from '../../const.js';

export default () => {
  const walletHandler = new WalletHandler();
  waitForFile(MY_SHOP_WALLET_PATH).then(() => { walletHandler.init(); });

  return async (ctx, next) => {
    ctx.walletHandler = walletHandler;

    await next();
  };
};
