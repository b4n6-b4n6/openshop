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

import newProduct from './newProduct.js';
import newProductPost from './newProductPost.js';
import viewProduct from './viewProduct.js';
import viewProductPost from './viewProductPost.js';

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

  .get('/shop/products/new', newProduct)
  .post('/shop/products/new', newProductPost)
  .get('/shop/products/:id', viewProduct)
  .post('/shop/products/:id', viewProductPost)

  .get('/self-test', selfTest)
  .get('/sync-status', syncStatus);

/*

  .post('/shop/products/new', )

  .get('/shop/products/:id/edit', )
  .post('/shop/products/:id/edit', )
*/

export default () => router.routes();
