import shopPage from '../pages/shopPage.js';
import checkOpenShopBrowser from '../utils/checkOpenShopBrowser.js';
import readMyShopAddress from '../utils/readMyShopAddress.js';

export default async (ctx) => {
  const onion = await readMyShopAddress();

  ctx.body = shopPage({
    enableBackButton: checkOpenShopBrowser(ctx),
    onion,
  });
};
