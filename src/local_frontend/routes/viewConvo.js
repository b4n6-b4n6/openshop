import viewConvoPage from '../pages/viewConvoPage.js';

export default async (ctx) => {
  const { id } = ctx.params;
  ctx.body = viewConvoPage({ userId: id });
};
