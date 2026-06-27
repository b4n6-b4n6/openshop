import rootPage from '../pages/rootPage.js';

export default async (ctx) => {
  ctx.body = rootPage();
};
