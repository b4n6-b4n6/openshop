import createPool from '../backend/createPool.js';
import loopNewMessages from './utils/loopNewMessages.js';
import loopOrderChanges from './utils/loopOrderChanges.js';
import { MY_SHOP_WALLET_PATH } from '../const.js';
import waitForFile from '../utils/waitForFile.js';

await waitForFile(MY_SHOP_WALLET_PATH);

const pool = createPool();

loopNewMessages(pool);
loopOrderChanges(pool);

console.log('Started!');
