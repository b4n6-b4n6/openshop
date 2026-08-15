import enhanceProducts from '../../backend/utils/enhanceProducts.js';
import productsPage from '../pages/productsPage.js';

export default async (ctx) => {
  const { backend, thumbCache } = ctx;
  const { products } = backend;

  ctx.body = productsPage({
    allProducts: await enhanceProducts({
      allProducts: await products.getAll(),
      products,
      thumbCache,
    }),
  });
};
