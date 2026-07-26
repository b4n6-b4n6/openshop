/* eslint-disable class-methods-use-this */
import moneroTs from 'monero-ts';
import depositListener from './depositListener.js';

export default () => (
  new class extends moneroTs.MoneroWalletListener {
    constructor() {
      super();
      this.lastLoggedSyncPercent = -5;
    }

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

    async onSyncProgress(height, startHeight, endHeight, percentDone) {
      const percent = Math.floor(percentDone * 100);
      if (percent < this.lastLoggedSyncPercent + 5 && percent !== 100) { return; }
      this.lastLoggedSyncPercent = percent;
      console.log(`Wallet sync ${percent}% (${height}/${endHeight}, start ${startHeight})`);
    }
  }()
);
