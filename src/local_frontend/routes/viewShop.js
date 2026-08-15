import enhanceShop from '../../backend/utils/enhanceShop.js';
import genQr from '../../utils/genQr.js';
import viewShopPage from '../pages/viewShopPage.js';

export default async (ctx) => {
  const { onionSpinner, backend, thumbCache } = ctx;
  const address = onionSpinner.onion;
  const { shops } = backend;

  const shop = await shops.getOrCreate(address);
  const enhancedShop = await enhanceShop({
    shop,
    shops,
    thumbCache,
    address,
  });

  const qr = await genQr(address);

  ctx.body = viewShopPage({
    ...enhancedShop,
    qr,
  });
};
