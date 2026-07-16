/* eslint-disable no-await-in-loop */
import moneroTs from 'monero-ts';
import { MONERO_RPC_URI, MY_SHOP_WALLET_PATH } from '../../../const.js';
import createListeners from './createListeners.js';

export default class WalletHandler {
  async init() {
    this.inited = false;
    this.lastError = null;

    const wallet = await moneroTs.openWalletFull({
      path: MY_SHOP_WALLET_PATH,
      password: '',
      networkType: moneroTs.MoneroNetworkType.MAINNET,
      server: { uri: MONERO_RPC_URI },
    });

    await wallet.addListener(createListeners());
    await wallet.startSyncing();

    this.wallet = wallet;
    this.depositSubaddressCounter = 0;
    this.inited = true;

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
