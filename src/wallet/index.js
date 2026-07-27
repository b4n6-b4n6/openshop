import { MY_SHOP_WALLET_PATH } from '../const.js';
import waitForFile from '../utils/waitForFile.js';
import createWalletHandler from './utils/WalletHandler/index.js';

await waitForFile(MY_SHOP_WALLET_PATH);
await createWalletHandler();
console.log('Started!');
