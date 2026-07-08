export default (ctx) => (
  ctx.headers['user-agent']?.startsWith('OpenShop')
);
