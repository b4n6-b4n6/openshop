import ordersPage from '../pages/ordersPage.js';

export default async (ctx) => {
  ctx.body = ordersPage({ shopAddress: ctx.myOnion });
};
