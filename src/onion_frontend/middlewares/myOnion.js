import readMyOnionHostname from '../../utils/readMyOnionHostname.js';

export default async () => {
  const myOnion = await readMyOnionHostname();

  return async (ctx, next) => {
    ctx.myOnion = myOnion;

    await next();
  };
};
