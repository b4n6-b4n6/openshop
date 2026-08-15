import newProductPage from '../pages/newProductPage.js';
import validateProductInput from '../utils/validateProductInput.js';

export default async (ctx) => {
  const { request, backend } = ctx;
  const { products } = backend;

  const photo = request.files.photo?.[0]?.buffer;
  const {
    name,
    description,
    price,
    currency,
    available_quantity,
  } = request.body;

  const error = validateProductInput({ price, available_quantity });
  if (error) {
    ctx.status = 400;
    ctx.body = newProductPage({
      error,
      values: {
        available_quantity,
        currency,
        description,
        name,
        price,
      },
    });
    return;
  }

  await products.create({
    name,
    photo,
    description,
    price,
    currency,
    available_quantity,
  });

  ctx.redirectWith303('/shop/products');
};
