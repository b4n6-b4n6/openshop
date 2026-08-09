import moneroTs from 'monero-ts';
import { MY_SHOP_WALLET_PATH } from '../../../const.js';
import checkAccess from '../../../utils/checkAccess.js';
import readMyWalletAddress from '../../../utils/readMyWalletAddress.js';

class WalletSetup {
  async init({
    checkWalletAccess = checkAccess,
    readWalletAddress = readMyWalletAddress,
  } = {}) {
    this.readWalletAddress = readWalletAddress;
    this.completed = await checkWalletAccess(MY_SHOP_WALLET_PATH);
    this.restoring = false;
    this.lastErrorMessage = null;
    this.address = this.completed ? await this.readWalletAddress() : null;

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
      this.address = await this.readWalletAddress();
    } catch (err) {
      console.error(err);

      this.lastErrorMessage = err.message;
    }
    this.restoring = false;
  }
}

const createWalletSetup = (...args) => (new WalletSetup()).init(...args);
export default createWalletSetup;
