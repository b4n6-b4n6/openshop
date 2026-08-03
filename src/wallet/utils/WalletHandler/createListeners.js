/* eslint-disable class-methods-use-this */
import moneroTs from 'monero-ts';
import { MY_SHOP_WALLET_SYNC_STATUS_IPC } from '../../../const.js';
import depositListener from './depositListener.js';
import { ipcWrite } from '../../../utils/ipc.js';

await ipcWrite(MY_SHOP_WALLET_SYNC_STATUS_IPC, '');

export default () => (
  new class extends moneroTs.MoneroWalletListener {
    async onOutputReceived(output) {
      const tx = output.getTx();

      const amount = Number(output.getAmount());
      const subaddressIndex = tx.getSubaddressIndex();
      const isConfirmed = tx.getIsConfirmed();
      const isLocked = tx.getIsLocked();
      const txid = tx.getHash();
      const isIncoming = tx.getIsIncoming();
      const isOutgoing = tx.getIsOutgoing();

      depositListener({
        amount,
        subaddressIndex,
        isConfirmed,
        isLocked,
        txid,
        isIncoming,
        isOutgoing,
      });
    }

    async onSyncProgress(height, startHeight, endHeight, percentDone, message) {
      const percent = Math.floor(percentDone * 100);
      const status = `${height} ${percent}`;
      console.log(
        `${(new Date()).toISOString()} ${height}/${percent}% (${message})`,
      );

      ipcWrite(MY_SHOP_WALLET_SYNC_STATUS_IPC, status);
    }
  }()
);
