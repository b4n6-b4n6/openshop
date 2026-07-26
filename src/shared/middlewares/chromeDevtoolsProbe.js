const CHROME_DEVTOOLS_PATH = '/.well-known/appspecific/com.chrome.devtools.json';

export default () => async (ctx, next) => {
  if (ctx.method === 'GET' && ctx.path === CHROME_DEVTOOLS_PATH) {
    ctx.status = 204;
    return;
  }

  await next();
};
