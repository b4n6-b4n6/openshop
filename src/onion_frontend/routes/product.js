import productPage from '../pages/productPage.js';

export default async (ctx) => {
  const { params, backend } = ctx;
  const { products } = backend;
  const { id } = params;

  const product = await products.get(id);
  if (!product) { throw new Error('no product'); }

  const {
    name,
    photo,
    description,
    price,
    currency,
    available_quantity,
  } = product;

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
