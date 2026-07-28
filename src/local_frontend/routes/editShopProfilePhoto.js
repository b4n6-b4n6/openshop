export default async (ctx) => {
  const { onionSpinner, backend } = ctx;
  const { shops } = backend;
  const address = onionSpinner.onion;
  const profile_photo = ctx.request.files?.photo[0].buffer;

  await shops.update({ address, profile_photo });

  ctx.redirect('/shop');
};
