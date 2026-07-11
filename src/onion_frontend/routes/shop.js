import shopPage from '../pages/shopPage.js';
import checkOpenShopBrowser from '../utils/checkOpenShopBrowser.js';
import readMyShopOnion from '../utils/readMyShopOnion.js';

export default async (ctx) => {
  const onion = await readMyShopOnion();

  ctx.body = shopPage({
    enableBackButton: checkOpenShopBrowser(ctx),
    onion,
  });
};
