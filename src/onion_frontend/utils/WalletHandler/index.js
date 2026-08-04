import { MY_SHOP_WALLET_SYNC_STATUS_IPC } from '../../../const.js';
import { ipcTrack } from '../../../utils/ipc.js';
import readMyWalletAddress from '../../../utils/readMyWalletAddress.js';

export default class WalletHandler {
  constructor() {
    this.height = null;
    this.percent = 0;

    ipcTrack(
      MY_SHOP_WALLET_SYNC_STATUS_IPC,
      async (data) => {
        if (!data) { return; }

        const [height, percent] = data.split(' ').map(Number);

        this.height = height;
        this.percent = percent;

        if (percent === 100 && !this.address) { this.address = await readMyWalletAddress(); }
      },
    );
  }
}
