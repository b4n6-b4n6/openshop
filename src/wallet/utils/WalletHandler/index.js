import moneroTs from 'monero-ts';
import { MONERO_RPC_URI, MY_SHOP_WALLET_PATH } from '../../../const.js';
import createListeners from './createListeners.js';
import createPool from '../../../backend/createPool.js';
import createOrders from '../../../backend/Orders/index.js';
import createProducts from '../../../backend/Products/index.js';

const SAVE_INTERVAL = 1000 * 60 * 15;

class WalletHandler {
  async init() {
    const pool = createPool();
    const orders = await createOrders(pool);
    const products = await createProducts(pool);

    const wallet = await moneroTs.openWalletFull({
      path: MY_SHOP_WALLET_PATH,
      password: 'password',
      networkType: moneroTs.MoneroNetworkType.MAINNET,
      server: { uri: MONERO_RPC_URI },
    });

    await wallet.addListener(createListeners({ orders, products }));
    await wallet.startSyncing();

    this.wallet = wallet;
    this.orders = orders;

    setInterval(
      () => { wallet.save(); },
      SAVE_INTERVAL,
    );

    return this;
  }
}

const createWalletHandler = (...args) => (new WalletHandler()).init(...args);
export default createWalletHandler;
