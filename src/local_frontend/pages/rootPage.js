import { button, document, logo } from '../../shared/pages/layout.js';

const rootPage = () => document({
  title: 'Welcome',
  body: (
    `<div class="mx-auto flex h-full max-w-[480px] flex-col bg-base px-6 page-enter">
      <div class="flex flex-1 flex-col items-center justify-center gap-8 pb-16 text-center">
        <div class="flex flex-col items-center gap-5">
          ${logo()}
          <div class="space-y-1.5">
            <h1 class="text-3xl font-extrabold tracking-tight text-text">OpenShop</h1>
            <p class="max-w-[16rem] text-[14px] text-muted">Spin up your own Monero shop, or browse one by its onion address.</p>
          </div>
        </div>
        <div class="flex w-full max-w-xs flex-col gap-3">
          ${button({ label: 'Open New Shop', href: '/wallet-setup' })}
          ${button({ label: 'Browse Shop', href: '/browser-input', variant: 'secondary' })}
        </div>
      </div>
    </div>`
  ),
});

export default rootPage;
