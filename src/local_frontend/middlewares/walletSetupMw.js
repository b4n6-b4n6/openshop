import createWalletSetup from '../utils/WalletSetup/index.js';

export default async () => {
  const walletSetup = await createWalletSetup();

  return async (ctx, next) => {
    ctx.walletSetup = walletSetup;

    await next();
  };
};
