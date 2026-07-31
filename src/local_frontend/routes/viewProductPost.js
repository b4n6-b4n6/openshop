export default async (ctx) => {
  const { request, backend, params } = ctx;
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

  await products.update({
    id,
    name,
    photo,
    description,
    price: price || '0',
    currency,
    available_quantity: available_quantity || '0',
  });

  ctx.redirect(`/shop/products/${id}`);
};
