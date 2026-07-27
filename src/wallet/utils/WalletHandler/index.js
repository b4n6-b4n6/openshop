/* eslint-disable no-await-in-loop */
import moneroTs from 'monero-ts';
import { MONERO_RPC_URI, MY_SHOP_WALLET_PATH } from '../../../const.js';
import createListeners from './createListeners.js';

const SAVE_INTERVAL = 1000 * 60 * 15;

class WalletHandler {
  async init() {
    const wallet = await moneroTs.openWalletFull({
      path: MY_SHOP_WALLET_PATH,
      password: 'password',
      networkType: moneroTs.MoneroNetworkType.MAINNET,
      server: { uri: MONERO_RPC_URI },
    });

    await wallet.addListener(createListeners());
    await wallet.startSyncing();

    this.wallet = wallet;
    this.depositSubaddressCounter = 0;

    setInterval(
      () => { wallet.save(); },
      SAVE_INTERVAL,
    );

    return this;
  }

  async getUnusedDepositSubaddress() {
    const synced = await this.wallet.isSynced();
    if (!synced) { throw new Error('wallet is not synced'); }

    for (;;) {
      const balance = await this.wallet.getBalance(0, this.depositSubaddressCounter);
      if (!balance) { break; }

      this.depositSubaddressCounter++; // ???? ok, ig... implement later
    }

    return (await this.wallet.getSubaddress(0, this.depositSubaddressCounter)).toString();
  }
}

const createWalletHandler = (...args) => (new WalletHandler()).init(...args);
export default createWalletHandler;
