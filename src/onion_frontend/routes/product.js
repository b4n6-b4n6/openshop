import productPage from '../pages/productPage.js';

export default async (ctx) => {
  const { params, backend } = ctx;
  const { products } = backend;
  const { id } = params;

  const {
    name,
    photo,
    description,
    price,
    currency,
    available_quantity,
  } = await products.get(id);

  ctx.body = productPage({
    id,
    name,
    photo,
    description,
    price,
    currency,
    available_quantity,
  });
};
