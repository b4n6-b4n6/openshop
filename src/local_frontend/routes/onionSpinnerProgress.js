import onionSpinnerProgressPage from '../pages/onionSpinnerProgressPage.js';
import onionErrorPage from '../pages/onionErrorPage.js';

export default async (ctx) => {
  const { onionSpinner } = ctx;

  if (onionSpinner.progress === 100) {
    if (!onionSpinner.onion) {
      ctx.status = 503;
      ctx.body = onionErrorPage();
      return;
    }
    ctx.redirect('/shop');
    return;
  }

  if (!onionSpinner.spinning) {
    onionSpinner.spinUp();
  }

  ctx.body = onionSpinnerProgressPage({ progress: onionSpinner.progress });
};
