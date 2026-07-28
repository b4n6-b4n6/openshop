import editShopPage from '../pages/editShopPage.js';

export default async (ctx) => {
  const { onionSpinner, backend } = ctx;
  const address = onionSpinner.onion;
  const { shops } = backend;

  let shop = await shops.get(address);
  if (!shop) {
    shop = {
      address,
      name: '',
      description: '',
      profile_photo: null,
      banner_photo: null,
    }
    await shops.update(shop)
  }

  ctx.body = editShopPage(shop);
};
