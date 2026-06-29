import readMyShopOnion from '../utils/readMyShopOnion.js';
import shopPage from '../pages/shopPage.js';

export default async (ctx) => {
  const onion = await readMyShopOnion();

  ctx.body = shopPage({ onion });
};
