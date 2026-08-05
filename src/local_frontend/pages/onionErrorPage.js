import {
  button,
  document,
  icon,
} from '../../shared/pages/layout.js';
import { escapeHtml } from '../../shared/utils/html.js';

const onionErrorPage = ({ message } = {}) => document({
  title: 'Shop unavailable',
  body: `<div class="mx-auto flex h-full max-w-[480px] flex-col items-center justify-center gap-5 bg-base px-8 text-center page-enter">
    <div class="flex size-14 items-center justify-center rounded-full bg-danger/15 text-danger">
      ${icon('wifiOff', 'size-7')}
    </div>
    <div class="space-y-1.5">
      <h1 class="text-lg font-bold tracking-wide text-text">SHOP UNAVAILABLE</h1>
      <p class="max-w-[18rem] text-[14px] text-muted">${escapeHtml(message || 'Tor finished bootstrapping, but the shop onion address is not available yet. Keep the onion launcher running and try again.')}</p>
    </div>
    <div class="flex w-60 flex-col gap-2.5 pt-2">
      ${button({ label: 'Try again', href: '/onion-spinner' })}
      ${button({ label: 'Back', href: '/', variant: 'secondary' })}
    </div>
  </div>`,
});

export default onionErrorPage;
