import walletSetupPage from '../pages/walletSetupPage.js';
import walletSetupProgressPage from '../pages/walletSetupProgressPage.js';

export default async (ctx) => {
  const { walletSetup } = ctx;

  if (walletSetup.restoring) {
    ctx.body = walletSetupProgressPage();
  } else if (walletSetup.completed) {
    ctx.redirect('/onion-spinner');
  } else {
    ctx.body = walletSetupPage();
  }
};
