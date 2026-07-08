import readMyShopOnion from '../utils/readMyShopOnion.js';

const JWT_COOKIE_EXTENSION = '.jwt';

export default async () => {
  const MY_SHOP_ONION = await readMyShopOnion();
  const JWT_COOKIE_NAME = MY_SHOP_ONION + JWT_COOKIE_EXTENSION;

  const constants = { MY_SHOP_ONION, JWT_COOKIE_NAME };
  return async (ctx, next) => {
    ctx.constants = constants;

    await next();
  };
};
