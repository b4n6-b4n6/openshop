export default async (ctx) => {
  const { walletSetup } = ctx;

  if (!walletSetup.completed && !walletSetup.restoring) {
    const { request } = ctx;
    const { primary_address, private_view_key, restore_height } = request.body;

    walletSetup.restore({
      primaryAddress: primary_address,
      privateViewKey: private_view_key,
      restoreHeight: restore_height,
    });
  }

  ctx.status = 303;
  ctx.redirect('/wallet-setup');
};
