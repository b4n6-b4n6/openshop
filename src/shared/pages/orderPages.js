import {
  emptyState,
  formatFiat,
  formatXmr,
  orderCard,
  orderStatus,
  orderStatusBadge,
  qrView,
  thumb,
} from './components.js';
import {
  appFrame,
  button,
  document,
  icon,
} from './layout.js';
import { escapeAttribute, escapeHtml } from '../utils/html.js';
import formatDate from '../../utils/formatDate.js';

const ownerScripts = ['sound.js'];

export const ordersPage = ({ owner = false, status = '' }) => (
  document({
    title: owner ? 'My Orders' : 'Orders',
    scripts: owner ? ownerScripts : [],
    body: appFrame({
      title: owner ? 'My Orders' : 'Orders',
      titleIcon: icon('receipt', 'size-4'),
      back: owner ? '/shop' : '/browser/',
      status,
      animate: false,
      content: (
        `<iframe
          title="Orders"
          src="${owner ? '/shop/orders/thread' : '/browser/orders/thread'}"
          class="live-frame h-full w-full border-0 bg-base"
        ></iframe>`
      ),
    }),
  })
);

export const ordersThreadPage = ({
  allOrders, owner = false, refresh,
}) => {
  const root = owner ? '/shop/orders' : '/browser/orders';

  return document({
    title: 'Orders',
    scripts: [],
    body: (
      `<div class="live-body">
        ${(allOrders.length
        ? (
          `<div class="flex flex-col gap-2.5 px-5 py-5">${(
            allOrders.map((order) => orderCard({
              order,
              href: `${root}/${encodeURIComponent(order.id)}`,
            })).join('')
          )}</div>`
        )
        : (
          emptyState({
            emptyIcon: 'receipt',
            title: 'No orders yet',
            description: owner
              ? 'Customer purchases will appear here.'
              : 'Your purchases will appear here.',
          })
        ))}
      </div>`
    ),
    refresh,
  });
};

const statusMessage = (order) => {
  if (order.deposit_confirmed_at) return 'Incoming transaction confirmed';
  if (order.deposit_detected_at) return 'Incoming transaction detected';
  return 'Waiting for incoming transaction';
};

const transactionDetails = (order) => (
  order.deposit_txid
    ? `<div class="rounded-xl border border-border bg-surface p-3">
      <p class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">Deposit txid</p>
      <div class="flex items-start gap-2">
        <span class="min-w-0 flex-1 break-all font-mono text-[11px] text-text">${escapeHtml(order.deposit_txid)}</span>
        <button type="button" data-copy="${escapeAttribute(order.deposit_txid)}" aria-label="Copy transaction ID" class="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-surface hover:text-text">
          ${icon('copy', 'size-4')}
        </button>
      </div>
    </div>`
    : ''
);

export const orderPage = ({
  thread,
  owner = false,
  status = '',
  back,
  chat,
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
        ></iframe>`
    ),
    bottom: (
      `<div class="flex flex-col gap-2.5">
          ${(owner
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
        : '')}
          ${(!owner
        ? (
          button({
            label: 'View my orders',
            href: back,
            variant: 'secondary',
            buttonIcon: icon('receipt', 'size-4'),
          })
        )
        : '')}
        </div>`
    ),
  }),
});

export const orderThreadPage = ({
  order,
  depositAddress,
  qr,
  version,
  refresh,
  owner,
}) => {
  const currentStatus = orderStatus(order);
  const complete = Boolean(order.deposit_confirmed_at);
  let statusTone = 'border-border bg-surface-2 text-muted';
  if (complete) {
    statusTone = 'border-success/30 bg-success/15 text-success';
  } else if (currentStatus.label === 'Detected') {
    statusTone = 'border-warning/30 bg-warning/15 text-warning';
  }
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
      `<div class="live-body space-y-4 px-5 py-6" data-order-live data-version="${escapeAttribute(version)}" data-complete="${complete}">
        <div class="flex items-center gap-3">
          ${thumb(order.product_photo, 64)}
          <div class="min-w-0 flex-1">
            <h2 class="truncate text-[15px] font-semibold text-text">${escapeHtml(order.product_name)}</h2>
            <p class="text-[13px] text-muted">${Number(order.purchase_quantity)} × ${escapeHtml(formatFiat(order.purchase_price, order.purchase_currency))}</p>
          </div>
          <div data-order-status-badge>${orderStatusBadge(order)}</div>
        </div>

        <section class="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-4 text-center">
          <div>
            <p class="font-mono text-3xl font-bold text-text">${escapeHtml(formatXmr(order.deposit_amount))}</p>
            <p class="mt-0.5 text-[13px] text-muted">XMR</p>
          </div>
          <p class="text-[13px] text-faint">≈ ${escapeHtml(formatFiat(order.purchase_price, order.purchase_currency))}</p>

              ${
      (qrView({
        qr,
        caption: depositAddress,
        fileName: `openshop-order-${order.id}.png`,
        size: 168,
      }))
      }

          <div class="w-full text-left">
            <p class="mb-1 text-[12px] font-semibold uppercase tracking-wide text-muted">Pay to this address</p>
            <div class="flex items-center gap-2 rounded-xl border border-border bg-surface-2 p-3">
              <span class="min-w-0 flex-1 break-all font-mono text-[12px] text-text">${escapeHtml(depositAddress)}</span>
              <button type="button" data-copy="${escapeAttribute(depositAddress)}" aria-label="Copy payment address" class="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-surface hover:text-text">
                ${icon('copy', 'size-4')}
              </button>
            </div>
          </div>
        </section>

        <div data-order-status-message class="rounded-xl border px-3 py-2 text-center text-[12px] font-semibold ${statusTone}">
          ${escapeHtml(statusMessage(order))}
        </div>

        <div class="grid grid-cols-2 gap-2.5 rounded-2xl border border-border bg-surface p-4 text-[12px]">
          <div>
            <p class="text-faint">Purchase quantity</p>
            <p class="mt-1 font-semibold text-text">${Number(order.purchase_quantity)}</p>
          </div>
          <div>
            <p class="text-faint">Purchase price</p>
            <p class="mt-1 font-semibold text-text">${escapeHtml(formatFiat(order.purchase_price, order.purchase_currency))}</p>
          </div>
          <div style="grid-column:1/-1" class="border-t border-border pt-2.5">
            <p class="text-faint">Created at</p>
            <p title="${escapeAttribute(order.created_at)}" class="mt-1 text-text">${escapeHtml(formatDate(order.created_at))}</p>
          </div>
        </div>

        <div data-order-txid>${transactionDetails(order)}</div>

        ${!order.deposit_txid
        ? `<p
              class="text-center text-[12px]leading-relaxed text-faint"
            >Send exactly this amount in Monero. The order updates automatically when the payment is detected and confirmed.</p>`
        : ''}
      </div>`
    ),
    refresh: !order.deposit_confirmed_at ? refresh : null,
  });
};
