import { addMinutes, formatDistanceToNow } from 'date-fns';
import {
  thumb,
} from './components.js';
import {
  orderStatus,
  orderStatusBadge,
} from './orderComponents.js';
import {
  qrViewButtonCrossFrame,
  qrViewModalCrossFrame,
} from './qr.js';
import {
  appFrame,
  button,
  document,
  icon,
} from './layout.js';
import { escapeAttribute, escapeHtml } from '../utils/html.js';
import formatDate from '../../utils/formatDate.js';
import formatFiat from '../utils/formatFiat.js';
import formatXmr from '../utils/formatXmr.js';
import transactionDetails from './transactionDetails.js';
import { ORDER_EXPIRY_PERIOD } from '../../const.js';

const ownerScripts = ['sound.js'];

const statusMessage = (order) => (
  false
  || (order.deposit_confirmed_at && 'Incoming transaction confirmed')
  || (order.deposit_detected_at && 'Incoming transaction detected')
  || (order.expired_at && 'Expired')
  || 'Waiting for incoming transaction'
);

export const orderPage = ({
  thread,
  owner = false,
  status = '',
  back,
  chat,
  qr,
  qrCaption,
  qrFileName,
}) => document({
  title: 'Order',
  scripts: [
    owner ? 'owner.js' : 'customer.js',
    ...(owner ? ownerScripts : []),
    'copy.js',
    'qr.js',
  ],
  body: appFrame({
    title: 'Order',
    titleIcon: icon('receipt', 'size-4'),
    back,
    status,
    content: (
      `<iframe
        title="Order"
        src="${escapeAttribute(thread)}"
        class="live-frame h-full w-full border-0 bg-base"
      ></iframe>

      ${qrViewModalCrossFrame({
        qr,
        caption: qrCaption,
        fileName: qrFileName,
        size: 168,
      })}`
    ),
    bottom: (
      `<div class="flex flex-col gap-2.5">
        ${owner
          ? `${button({
            label: 'Chat with customer',
            href: chat,
            variant: 'secondary',
            buttonIcon: icon('message', 'size-4'),
          })}${button({
            label: 'View all orders',
            href: back,
            variant: 'secondary',
            buttonIcon: icon('receipt', 'size-4'),
          })}`
          : ''}

        ${!owner
          ? (
            button({
              label: 'View my orders',
              href: back,
              variant: 'secondary',
              buttonIcon: icon('receipt', 'size-4'),
            })
          )
          : ''}
      </div>`
    ),
  }),
});

const checkOrderComplete = (order) => Boolean(order.deposit_confirmed_at);
const checkOrderExpire = (order) => Boolean(order.expired_at);

export const orderThreadPage = ({
  order,
  depositAddress,
  qr,
  version,
  refresh,
  owner,
}) => {
  const currentStatus = orderStatus(order);
  const complete = checkOrderComplete(order);
  const expire = checkOrderExpire(order);
  const expires_at = addMinutes(order.created_at, ORDER_EXPIRY_PERIOD);

  const scripts = [
    owner ? 'owner.js' : 'customer.js',
    ...(owner ? ownerScripts : []),
    'copy.js',
    'qr.js',
  ];

  return document({
    title: 'Order',
    scripts,
    body: (
      `<div
        class="live-body space-y-4 px-5 py-6"
        data-order-live
        data-version="${escapeAttribute(version)}"
        data-complete="${complete}"
      >
        <div class="flex items-center gap-3">
          ${thumb(order.product_photo, 64)}

          <div class="min-w-0 flex-1">
            <h2
              class="truncate text-[15px] font-semibold text-text"
            >${escapeHtml(order.product_name)}</h2>

            <p
              class="text-[13px] text-muted"
            >${Number(order.purchase_quantity)} × ${escapeHtml(formatFiat(order.purchase_price, order.purchase_currency))}</p>
          </div>
          <div data-order-status-badge>${orderStatusBadge(order)}</div>
        </div>

        <section class="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-4 text-center">
          <div>
            <p class="font-mono text-3xl font-bold text-text">${escapeHtml(formatXmr(order.deposit_amount))}</p>
            <p class="mt-0.5 text-[13px] text-muted">XMR</p>
          </div>
          <p
            class="text-[13px] text-faint"
          >≈ ${escapeHtml(formatFiat(order.purchase_price, order.purchase_currency))}</p>

          ${qrViewButtonCrossFrame({ qr, size: 168 })}

          <div class="w-full text-left">
            <p class="mb-1 text-[12px] font-semibold uppercase tracking-wide text-muted">Pay to this address</p>
            <div class="flex items-center gap-2 rounded-xl border border-border bg-surface-2 p-3">
              <span
                class="min-w-0 flex-1 break-all font-mono text-[12px] text-text"
              >${escapeHtml(depositAddress)}</span>
              <button
                type="button"
                data-copy="${escapeAttribute(depositAddress)}"
                aria-label="Copy payment address"
                class="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-surface hover:text-text"
              >
                ${icon('copy', 'size-4')}
              </button>
            </div>
          </div>
        </section>

        <div
          data-order-status-message
          class="rounded-xl border px-3 py-2 text-center text-[12px] font-semibold ${currentStatus.statusTone}"
        >
          ${escapeHtml(statusMessage(order))}
        </div>

        <div class="grid grid-cols-2 gap-2.5 rounded-2xl border border-border bg-surface p-4 text-[12px]">
          <div>
            <p class="text-faint">Purchase quantity</p>
            <p class="mt-1 font-semibold text-text">${Number(order.purchase_quantity)}</p>
          </div>
          <div>
            <p class="text-faint">Purchase price</p>
            <p
              class="mt-1 font-semibold text-text"
            >${escapeHtml(formatFiat(order.purchase_price, order.purchase_currency))}</p>
          </div>
          <div
            style="grid-column:1/-1"
            class="border-t border-border pt-2.5"
          >
            <p class="text-faint">Created at</p>
            <p
              title="${escapeAttribute(order.created_at)}"
              class="mt-1 text-text"
            >${escapeHtml(formatDate(order.created_at))}</p>
          </div>
        </div>

        <div data-order-txid>${transactionDetails(order)}</div>

        ${!order.deposit_txid && !expire
        ? (
          `<p
            class="text-center text-[12px] leading-relaxed text-faint"
          >Send exactly this amount in Monero. The order updates automatically when the payment is detected and confirmed. The order expires in <span class="font-bold" title="${escapeAttribute(expires_at)}">${escapeHtml(formatDistanceToNow(expires_at))}</span> - please be sure to <span class='font-bold'>pay before</span> this time!</p>`
        )
        : ''}
      </div>`
    ),
    refresh: (complete || expire) ? null : refresh,
  });
};
