import newProductPage from '../pages/newProductPage.js';

export default async (ctx) => {
  ctx.body = newProductPage();
};
