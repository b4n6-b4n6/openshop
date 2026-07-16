import moneroTs from 'monero-ts';
import fs from 'node:fs/promises';
import path from 'node:path';
import { MY_SHOP_WALLET_PATH } from '../../../const.js';
import checkAccess from '../../../utils/checkAccess.js';
import { errorBody, toPublicError } from '../../../utils/publicError.js';

class WalletSetup {
  async init() {
    this.completed = await checkAccess(MY_SHOP_WALLET_PATH);
    this.restoring = false;
    this.lastError = null;

    return this;
  }

  async restore({ primaryAddress, privateViewKey, restoreHeight }) {
    if (this.restoring || this.completed) { return; }

    this.restoring = true;
    this.lastError = null;
    try {
      await fs.mkdir(path.dirname(MY_SHOP_WALLET_PATH), { recursive: true });

      const wallet = await moneroTs.createWalletFull({
        path: MY_SHOP_WALLET_PATH,
        password: '',
        networkType: moneroTs.MoneroNetworkType.MAINNET,
        primaryAddress,
        privateViewKey,
        restoreHeight: Number(restoreHeight),
      });

      await wallet.close(true);

      this.completed = true;
      this.lastError = null;
    } catch (err) {
      console.error(err);
      this.lastError = errorBody(toPublicError(err, {
        code: 'wallet_restore_failed',
        message: 'The view-only wallet could not be restored. Check the wallet details and try again.',
      })).error;
    } finally {
      this.restoring = false;
    }
  }
}

const createWalletSetup = (...args) => (new WalletSetup()).init(...args);
export default createWalletSetup;
