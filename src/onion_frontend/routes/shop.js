import checkOpenShopBrowser from '../utils/checkOpenShopBrowser.js';
import shopPage from '../pages/shopPage.js';

export default async (ctx) => {
  const { myOnion, backend } = ctx;
  const { shops } = backend;

  const shop = await shops.get(myOnion);

  ctx.body = shopPage({
    enableBackButton: checkOpenShopBrowser(ctx),
    ...shop,
  });
};
