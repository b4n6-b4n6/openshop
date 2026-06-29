import onionSpinnerProgressPage from '../pages/onionSpinnerProgressPage.js';

export default async (ctx) => {
  const { onionSpinner } = ctx;

  if (!onionSpinner.isSpinning) {
    onionSpinner.spinUp();
  }

  ctx.body = onionSpinnerProgressPage({ progress: onionSpinner.progress });
};
