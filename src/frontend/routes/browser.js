export default async (ctx) => {
  const { onion } = ctx.session;

  if (!onion) {
    ctx.redirect('/browser-input');
  }
};
