import moneroTs from 'monero-ts';
import { MY_SHOP_WALLET_PATH } from '../../../const.js';
import checkAccess from '../../../utils/checkAccess.js';

class WalletSetup {
  async init() {
    this.completed = await checkAccess(MY_SHOP_WALLET_PATH);
    this.restoring = false;
    this.lastErrorMessage = null;

    return this;
  }

  async restore({ primaryAddress, privateViewKey, restoreHeight }) {
    if (this.restoring || this.completed) { return; }

    this.restoring = true;
    try {
      const wallet = await moneroTs.createWalletFull({
        path: MY_SHOP_WALLET_PATH,
        password: 'password',
        networkType: moneroTs.MoneroNetworkType.MAINNET,
        primaryAddress,
        privateViewKey,
        restoreHeight,
      });

      await wallet.close(true);

      this.completed = true;
      this.lastErrorMessage = null;
    } catch (err) {
      console.error(err);

      this.lastErrorMessage = err.message;
    }
    this.restoring = false;
  }
}

const createWalletSetup = (...args) => (new WalletSetup()).init(...args);
export default createWalletSetup;
