import assertImage from '../utils/assertImage.js';

export default async (ctx) => {
  const {
    request, backend, params, thumbnailCache,
  } = ctx;
  const { products } = backend;
  const { id } = params;
  const photo = request.files.photo?.[0]?.buffer;

  const {
    name,
    description,
    price,
    currency,
    available_quantity,
  } = request.body;

  if (photo) { await assertImage(photo); }

  await products.update({
    id,
    name,
    photo,
    description,
    price: price || '0',
    currency,
    available_quantity: available_quantity || '0',
  });

  if (photo) { await thumbnailCache.clear(`product:${id}`); }

  ctx.redirect(`/shop/products/${id}`);
};
