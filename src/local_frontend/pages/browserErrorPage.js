import {
  button,
  document,
  icon,
} from '../../shared/pages/layout.js';
import { escapeHtml } from '../../shared/utils/html.js';

const browserErrorPage = ({ message }) => document({
  title: 'Connection Error',
  body: `<div class="mx-auto flex h-full max-w-[480px] flex-col items-center justify-center gap-5 bg-base px-8 text-center page-enter">
    <div class="flex size-14 items-center justify-center rounded-full bg-danger/15 text-danger">
      ${icon('wifiOff', 'size-7')}
    </div>
    <div class="space-y-1.5">
      <h1 class="text-lg font-bold tracking-wide text-text">ERROR</h1>
      <p class="max-w-[16rem] text-[14px] text-muted">${escapeHtml(message || "Couldn't reach that shop. It may be offline — that's normal for P2P shops. Try again later.")}</p>
    </div>
    <div class="w-60 pt-2">
      ${button({ label: 'Back', href: '/browser-input', variant: 'secondary' })}
    </div>
  </div>`,
});

export default browserErrorPage;
