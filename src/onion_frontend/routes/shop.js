import readMyShopOnion from '../utils/readMyShopOnion.js';
import shopPage from '../pages/shopPage.js';

export default async (ctx) => {
  const onion = await readMyShopOnion();
  const isOpenShopBrowser = (
    ctx.headers['user-agent']?.startsWith('OpenShop')
  );
  console.log(ctx.headers);

  ctx.body = shopPage({
    enableBackButton: isOpenShopBrowser,
    onion,
  });
};
