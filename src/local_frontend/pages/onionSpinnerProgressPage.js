import { document, logo } from '../../shared/pages/layout.js';

const onionSpinnerProgressPage = ({ progress }) => document({
  title: 'Opening Shop',
  refresh: progress === 100 ? '0; URL=/shop' : '2',
  body: (
    `<div class="mx-auto flex h-full max-w-[480px] flex-col items-center justify-center gap-6 bg-base px-8 text-center page-enter">
      ${logo(72)}
      <div class="size-12 animate-spin rounded-full border-[3px] border-border-strong border-t-accent"></div>
      <div class="space-y-1">
        <h1 class="text-lg font-bold tracking-wide text-text">SPINNING UP ONION</h1>
        <p class="text-[13px] text-muted">Publishing your shop to the Tor network…</p>
        <p class="pt-2 font-mono text-[12px] text-faint">${Number(progress)}%</p>
      </div>
    </div>`
  ),
});

export default onionSpinnerProgressPage;
