import {
  appFrame,
  button,
  document,
  field,
  icon,
} from '../../shared/pages/layout.js';

const browserInputPage = ({ defaultOnionHostname }) => document({
  title: 'Browse Shop',
  scripts: ['browse.js'],
  body: `<form action="/browser-input" method="post" class="contents" data-browse-form>
    ${appFrame({
    title: 'Browse Shop',
    back: '/',
    content: `<div data-browse-fields class="space-y-5 px-5 py-6">
        <p class="text-[14px] text-muted">Paste the shop&apos;s onion address to connect over Tor, or scan its QR code.</p>
        ${field({
    label: 'Shop address',
    name: 'browsed_onion_address',
    value: defaultOnionHostname,
    placeholder: 'xxxxxxxx…onion',
    mono: true,
    attributes: 'type="text" autofocus required autocapitalize="none" autocomplete="off" spellcheck="false"',
  })}
        ${button({
    label: 'Scan QR code',
    variant: 'secondary',
    buttonIcon: icon('qr', 'size-4'),
    attributes: 'data-scan-qr',
  })}
        <input data-qr-file type="file" accept="image/*" capture="environment" class="hidden">
        <p data-qr-error role="alert" class="hidden text-[13px] text-danger"></p>
      </div>
      <div class="browse-loading h-full flex-col items-center justify-center px-6 pb-16 text-center">
        <div class="mb-5 size-12 animate-spin rounded-full border-[3px] border-border-strong border-t-accent"></div>
        <h2 class="text-lg font-bold tracking-wide text-text">CONNECTING</h2>
        <p class="mt-2 max-w-[260px] text-[13px] text-muted">Reaching the shop through Tor…</p>
      </div>`,
    bottom: button({ label: 'Enter', type: 'submit' }),
  })}
  </form>`,
});

export default browserInputPage;
