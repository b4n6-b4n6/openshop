import viewMyShopPage from '../pages/viewMyShopPage.js';
import OnionSpinner from '../utils/OnionSpinner/index.js';

export default async (ctx) => {
  const { onionSpinner } = ctx;

  ctx.body = viewMyShopPage({ onion: onionSpinner.onion });
};
