/* eslint-disable no-await-in-loop */
import moneroTs from 'monero-ts';
import { MONERO_RPC_URI, MY_SHOP_WALLET_PATH } from '../../../const.js';
import createListeners from './createListeners.js';
import { errorBody, toPublicError } from '../../../utils/publicError.js';

export default class WalletHandler {
  constructor() {
    this.inited = false;
    this.lastError = null;
  }

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

  async getSyncState() {
    if (this.lastError) { return 'error'; }
    if (!this.inited || !this.wallet) { return 'syncing'; }

    try {
      return await this.wallet.isSynced() ? 'synced' : 'syncing';
    } catch (error) {
      console.error(error);
      this.lastError = errorBody(toPublicError(error, {
        code: 'wallet_sync_failed',
        message: 'The Monero wallet sync status could not be read.',
      })).error;
      return 'error';
    }
  }

  async getUnusedDepositSubaddress() {
    const synced = await this.wallet.isSynced();
    if (!synced) { throw new Error('wallet is not synced'); }

    for (;;) {
      const balance = await this.wallet.getBalance(0, this.depositSubaddressCounter);
      if (!balance) { break; }

      this.depositSubaddressCounter++; // ???? ok, ig... implement later
    }

    const subaddress = await this.wallet.getSubaddress(0, this.depositSubaddressCounter);
    return subaddress.getAddress();
  }
}
