import enhanceProducts from '../../backend/utils/enhanceProducts.js';
import viewProductsPage from '../pages/viewProductsPage.js';

export default async (ctx) => {
  const { backend, thumbCache } = ctx;
  const { products } = backend;

  ctx.body = viewProductsPage({
    allProducts: await enhanceProducts({
      allProducts: await products.getAll(),
      products,
      thumbCache,
    }),
  });
};
