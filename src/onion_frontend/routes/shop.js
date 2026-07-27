import shopPage from '../pages/shopPage.js';
import checkOpenShopBrowser from '../utils/checkOpenShopBrowser.js';

export default async (ctx) => {
  ctx.body = shopPage({
    enableBackButton: checkOpenShopBrowser(ctx),
    onion: ctx.myOnion,
  });
};
