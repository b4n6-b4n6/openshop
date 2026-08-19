import {
  avatar,
  richText,
  shopBanner,
} from '../../shared/pages/components.js';
import {
  appFrame,
  button,
  document,
  icon,
} from '../../shared/pages/layout.js';
import { qrView } from '../../shared/pages/qr.js';
import { escapeAttribute, escapeHtml } from '../../shared/utils/html.js';
import truncateMiddle from '../../shared/utils/truncateMiddle.js';

const shopPage = ({
  enableBackButton,
  address,
  name,
  description,
  profile_photo,
  banner_photo,
  qr,
}) => document({
  title: name || 'Shop',
  scripts: ['customer.js', 'copy.js', 'qr.js'],
  body: appFrame({
    title: 'Shop',
    titleIcon: icon('store', 'size-4'),
    back: enableBackButton ? '/browser-input' : '',
    content: `${shopBanner(banner_photo)}
      <div class="px-5">
        <div class="relative z-10 -mt-8 mb-3 w-fit">${avatar(profile_photo)}</div>

        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <h2 class="truncate text-xl font-bold text-text">${escapeHtml(name || 'Unnamed shop')}</h2>
            <div class="mt-1 flex items-center gap-1">
              <span class="truncate font-mono text-[12px] text-muted">${escapeHtml(truncateMiddle(address))}</span>
              <button type="button" data-copy="${escapeAttribute(address)}" aria-label="Copy address" class="inline-flex size-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-2 hover:text-text">
                ${icon('copy', 'size-4')}
              </button>
            </div>
          </div>
          ${qrView({
    qr,
    caption: address,
    fileName: 'openshop-address.png',
  })}
        </div>

        ${description ? `<div class="mt-3">${richText(description)}</div>` : ''}

        <div class="mt-5 mb-6 flex flex-col gap-2.5">
          ${button({
    label: 'Products',
    href: '/browser/products',
    buttonIcon: icon('boxes', 'size-4'),
  })}
          ${button({
    label: 'Chat',
    href: '/browser/convo',
    variant: 'secondary',
    buttonIcon: icon('message', 'size-4'),
  })}
          ${button({
    label: 'Orders',
    href: '/browser/orders',
    variant: 'secondary',
    buttonIcon: icon('receipt', 'size-4'),
  })}
        </div>
      </div>`,
  }),
});

export default shopPage;
