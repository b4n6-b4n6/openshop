import viewOrdersPage from '../pages/viewOrdersPage.js';

export default async (ctx) => {
  ctx.body = viewOrdersPage();
};
