import myShopViewPage from '../pages/myShopViewPage.js';

export default async (ctx) => {
  const { onionSpinner } = ctx;

  ctx.body = myShopViewPage({ onion: onionSpinner.onion });
};
