import {
  avatar,
  hubLink,
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
import indicators from './indicators.js';

const CLOSE_TEXT = 'Your shop screen will close. The service launchers continue running until you stop them in their terminals.';
const UNNAMED_SHOP_TEXT = 'Unnamed shop';

const viewShopPage = ({
  address,
  name,
  description,
  profile_photo,
  banner_photo,
  qr,
}) => document({
  title: 'My Shop',
  scripts: ['owner.js', 'copy.js', 'sound.js', 'qr.js'],
  body: appFrame({
    title: 'My Shop',
    titleIcon: icon('store', 'size-4'),
    status: indicators(),
    content: (
      `${shopBanner(banner_photo)}

      <div class="px-5">
        <div class="relative z-10 -mt-8 mb-3 w-fit">${avatar(profile_photo)}</div>

        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <h2
              class="truncate text-xl font-bold text-text"
            >${escapeHtml(name || UNNAMED_SHOP_TEXT)}</h2>

            <div class="mt-1 flex items-center gap-1">
              <span
                class="truncate font-mono text-[12px] text-muted"
              >${escapeHtml(truncateMiddle(address))}</span>

              <button
                type="button"
                data-copy="${escapeAttribute(address)}"
                aria-label="Copy address"
                class="inline-flex size-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-2 hover:text-text"
              >
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

        ${description
          ? `<div class="mt-3">${richText(description)}</div>`
          : '<p class="mt-3 text-[14px] text-faint">No description yet. Tap “Edit shop” to add one.</p>'
        }

        <div class="mt-5 grid grid-cols-2 gap-2.5">
          ${button({
            label: 'Edit shop',
            href: '/shop/settings',
            variant: 'secondary',
            buttonIcon: icon('pencil', 'size-4'),
          })}
          ${button({
            label: 'Add product',
            href: '/shop/products/new',
            variant: 'secondary',
            buttonIcon: icon('plus', 'size-4'),
          })}
        </div>

        <div class="mt-3 flex flex-col gap-2.5">
          ${hubLink({
            href: '/shop/products',
            label: 'View my products',
            linkIcon: 'boxes',
          })}
          ${hubLink({
            href: '/shop/orders',
            label: 'View my orders',
            linkIcon: 'receipt',
          })}
          ${hubLink({
            href: '/shop/convos',
            label: 'View my chats',
            linkIcon: 'message',
            unread: false,
          })}
        </div>

        <div class="my-6">
          ${button({
            label: 'Close shop',
            variant: 'danger',
            buttonIcon: icon('power', 'size-4'),
            attributes: 'data-close-shop-open',
          })}
        </div>
      </div>

      <div
        data-close-shop-modal
        class="owner-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Close shop"
        hidden
      >
        <div class="owner-modal-panel">
          <h2
            class="text-lg font-bold text-text"
          >Close shop?</h2>

          <p
            class="mt-2 text-[14px] leading-relaxed text-muted"
          >${CLOSE_TEXT}</p>

          <div class="mt-5 flex flex-col gap-2.5">
            ${button({
              label: 'Close shop',
              href: '/',
              variant: 'danger',
            })}
            ${button({
              label: 'Cancel',
              variant: 'ghost',
              attributes: 'data-close-shop-cancel',
            })}
          </div>
        </div>
      </div>`
    ),
  }),
});

export default viewShopPage;
