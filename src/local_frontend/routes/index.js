import Router from '@koa/router';
import root from './root.js';

import browserInput from './browserInput.js';
import browserInputPost from './browserInputPost.js';
import walletSetupProgress from './walletSetupProgress.js';
import walletSetupPost from './walletSetupPost.js';
import onionSpinnerProgress from './onionSpinnerProgress.js';
import browser from './browser.js';

import viewShop from './viewShop.js';
import editShop from './editShop.js';
import editShopPost from './editShopPost.js';
import editShopProfilePhoto from './editShopProfilePhoto.js';
import editShopBannerPhoto from './editShopBannerPhoto.js';

import viewProducts from './viewProducts.js';
import newProduct from './newProduct.js';
import newProductPost from './newProductPost.js';
import viewProduct from './viewProduct.js';
import viewProductPost from './viewProductPost.js';

import viewOrder from './viewOrder.js';
import viewOrders from './viewOrders.js';

import viewConvos from './viewConvos.js';
import viewConvosThread from './viewConvosThread.js';
import viewConvo from './viewConvo.js';
import viewConvoThread from './viewConvoThread.js';
import viewConvoPost from './viewConvoPost.js';
import downloadImage from '../../shared/routes/downloadImage.js';

import selfTest from './selfTest.js';
import syncStatus from './syncStatus.js';

const router = new Router();
router
  .get('/', root)

  .get('/browser-input', browserInput)
  .post('/browser-input', browserInputPost)
  .get('/wallet-setup', walletSetupProgress)
  .post('/wallet-setup', walletSetupPost)
  .get('/onion-spinner', onionSpinnerProgress)
  .all('/browser{/*browsePath}', browser)

  .get('/shop', viewShop)
  .get('/shop/settings', editShop)
  .post('/shop/settings', editShopPost)
  .post('/shop/settings/profile-photo', editShopProfilePhoto)
  .post('/shop/settings/banner-photo', editShopBannerPhoto)

  .get('/shop/products', viewProducts)
  .get('/shop/products/new', newProduct)
  .post('/shop/products/new', newProductPost)
  .get('/shop/products/:id', viewProduct)
  .post('/shop/products/:id', viewProductPost)

  .get('/shop/orders/:id', viewOrder)
  .get('/shop/orders', viewOrders)

  .get('/shop/convos', viewConvos)
  .get('/shop/convos/thread', viewConvosThread)
  .get('/shop/convos/:id/thread', viewConvoThread)
  .get('/shop/convos/:id', viewConvo)
  .post('/shop/convos/:id', viewConvoPost)
  .get('/shop/convos/images/:id', downloadImage)

  .get('/self-test', selfTest)
  .get('/sync-status', syncStatus);

export default () => router.routes();
