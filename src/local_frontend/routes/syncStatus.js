import syncStatusResult from '../pages/syncStatusResult.js';
import { MY_SHOP_WALLET_SYNC_STATUS_IPC } from '../../const.js';
import { ipcRead } from '../../utils/ipc.js';

export default async (ctx) => {
  const data = await ipcRead(MY_SHOP_WALLET_SYNC_STATUS_IPC);
console.log(data)

  if (!data) {
    ctx.body = syncStatusResult();
    return;
  }

  const [height, percent] = data.split(' ');
  ctx.body = syncStatusResult({ height, percent });
};
