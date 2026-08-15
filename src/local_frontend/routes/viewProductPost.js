import assertImage from '../../utils/assertImage.js';
import viewProductPage from '../pages/viewProductPage.js';
import validateProductInput from '../utils/validateProductInput.js';

export default async (ctx) => {
  const {
    request, backend, params, thumbCache,
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

  const error = validateProductInput({ price, available_quantity });
  if (error) {
    ctx.status = 400;
    ctx.body = viewProductPage({
      id,
      name,
      description,
      price,
      currency,
      available_quantity,
      error,
    });
    return;
  }

  await products.update({
    id,
    name,
    photo,
    description,
    price,
    currency,
    available_quantity: available_quantity || '0',
  });

  if (photo) { await thumbCache.clear(`product:${id}`); }

  ctx.redirectWith303('/shop/products');
};
