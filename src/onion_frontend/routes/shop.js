import shopPage from '../pages/shopPage.js';
import checkOpenShopBrowser from '../utils/checkOpenShopBrowser.js';

export default async (ctx) => {
  const onion = ctx.constants.MY_SHOP_ONION;

  ctx.body = shopPage({
    enableBackButton: checkOpenShopBrowser(ctx),
    onion,
  });
};
