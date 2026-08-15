import enhanceShop from '../../backend/utils/enhanceShop.js';
import editShopPage from '../pages/editShopPage.js';

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

  ctx.body = editShopPage(enhancedShop);
};
