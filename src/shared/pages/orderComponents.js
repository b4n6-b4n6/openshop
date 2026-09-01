import formatDate from '../../utils/formatDate.js';
import formatFiat from '../utils/formatFiat.js';
import formatXmr from '../utils/formatXmr.js';
import { escapeAttribute, escapeHtml } from '../utils/html.js';
import { thumb } from './components.js';

export const orderStatus = (order) => (
  false
  || (order.deposit_confirmed_at
    && { label: 'Confirmed', classes: 'bg-success/15 text-success', statusTone: 'border-success/30 bg-success/15 text-success' })
  || (order.deposit_detected_at
    && { label: 'Detected', classes: 'bg-warning/15 text-warning', statusTone: 'border-warning/30 bg-warning/15 text-warning' })
  || (order.expired_at
    && { label: 'Expired', classes: 'bg-danger/15 text-danger', statusTone: 'border-danger/30 bg-danger/15 text-danger' })
  || { label: 'Pending', classes: 'bg-surface-2 text-muted', statusTone: 'border-border bg-surface-2 text-muted' }
);

export const orderStatusBadge = (order) => {
  const status = orderStatus(order);

  return (
    `<span class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.classes}">${status.label}</span>`
  );
};

export const orderCard = ({ order, href }) => {
  const card = `<article class="space-y-3 rounded-2xl border border-border bg-surface p-4">
    <div class="flex items-center gap-3">
      ${thumb(order.product_photo)}

      <div class="min-w-0 flex-1">
        <p
          class="truncate text-[15px] font-semibold text-text"
        >${escapeHtml(order.product_name)}</p>
        <p
          class="text-[13px] text-muted"
        >${Number(order.purchase_quantity)} × ${escapeHtml(formatFiat(order.purchase_price, order.purchase_currency))}</p>
      </div>

      ${orderStatusBadge(order)}
    </div>

    <div class="flex items-center justify-between border-t border-border pt-2.5 text-[12px]">
      <span
        class="font-mono text-muted"
      >${escapeHtml(formatXmr(order.deposit_amount))} XMR</span>

      <span
        title="${escapeAttribute(order.created_at)}"
        class="text-faint"
      >${escapeHtml(formatDate(order.created_at))}</span>
    </div>
  </article>`;

  return href
    ? (
      `<a
        target="_top"
        href="${escapeAttribute(href)}"
        class="block active:scale-[0.99]"
        aria-label="View order for ${escapeAttribute(order.product_name)}"
      >${card}</a>`
    )
    : card;
};
