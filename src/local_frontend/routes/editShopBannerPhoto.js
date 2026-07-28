export default async (ctx) => {
  const { onionSpinner, backend } = ctx;
  const { shops } = backend;
  const address = onionSpinner.onion;
  const banner_photo = ctx.request.files?.photo[0].buffer;

  await shops.update({ address, banner_photo });

  ctx.redirect('/shop');
};
