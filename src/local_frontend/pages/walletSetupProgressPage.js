import { document, logo } from '../../shared/pages/layout.js';

const walletSetupProgressPage = () => document({
  title: 'Creating Wallet',
  refresh: '2',
  body: (
    `<div class="mx-auto flex h-full max-w-[480px] flex-col items-center justify-center gap-6 bg-base px-8 text-center page-enter">
      ${logo(72)}

      <div class="size-12 animate-spin rounded-full border-[3px] border-border-strong border-t-accent"></div>
      <div class="space-y-1">
        <h1 class="text-lg font-bold tracking-wide text-text">CREATING WALLET</h1>
        <p class="text-[13px] text-muted">Restoring the view-only Monero wallet on this device…</p>
      </div>
    </div>`
  ),
});

export default walletSetupProgressPage;
