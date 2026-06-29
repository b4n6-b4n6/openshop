import myShopPage from '../pages/myShopPage.js';

export default async (ctx) => {
  const { onionSpinner } = ctx;

  ctx.body = myShopPage({ onion: onionSpinner.onion });
};
