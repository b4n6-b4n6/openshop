export default async (ctx) => {
  const { onionSpinner, backend, thumbnailCache } = ctx;
  const { shops } = backend;
  const address = onionSpinner.onion;
  const profile_photo = ctx.request.files.photo?.[0]?.buffer;

  await shops.update({ address, profile_photo });
  await thumbnailCache.clear('profile_photo');

  ctx.redirect('/shop');
};
