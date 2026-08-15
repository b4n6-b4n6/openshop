import checkOpenShopBrowser from '../utils/checkOpenShopBrowser.js';
import shopPage from '../pages/shopPage.js';
import genQr from '../../utils/genQr.js';
import enhanceShop from '../../backend/utils/enhanceShop.js';

export default async (ctx) => {
  const { myOnion, backend, thumbCache } = ctx;
  const { shops } = backend;

  const shop = await shops.get(myOnion);
  if (!shop) { ctx.throw(404, 'Shop not found'); }

  const enhancedShop = await enhanceShop({
    shop,
    shops,
    thumbCache,
    address: myOnion,
  });
  const qr = await genQr(myOnion);

  ctx.body = shopPage({
    ...enhancedShop,
    enableBackButton: checkOpenShopBrowser(ctx),
    qr,
  });
};
