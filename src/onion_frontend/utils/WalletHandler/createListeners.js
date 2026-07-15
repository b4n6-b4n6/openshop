/* eslint-disable class-methods-use-this */
import moneroTs from 'monero-ts';
import depositListener from './depositListener.js';

export default () => (
  new class extends moneroTs.MoneroWalletListener {
    async onOutputReceived(output) {
      const tx = output.getTx();

      const amount = output.getAmount();
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
      console.log('onSyncProgress', height, startHeight, endHeight, percentDone, message);
    }
  }()
);
