/* eslint-disable no-constant-binary-expression */
import { CURRENCIES } from '../../const.js';
import formatDate from '../../utils/formatDate.js';
import { renderBbcode } from '../utils/bbcode.js';
import formatFiat from '../utils/formatFiat.js';
import formatXmr from '../utils/formatXmr.js';
import { escapeAttribute, escapeHtml } from '../utils/html.js';
import { icon } from './layout.js';

const dataImage = (value) => (
  typeof value === 'string' && /^data:image\/(?:gif|jpeg|png|webp);base64,/i.test(value)
);

export const richText = (description) => (
  `<div class="rich-text">${renderBbcode(description)}</div>`
);

export const avatar = (src, size = 72) => (
  `<div
    style="width:${size}px;height:${size}px"
    class="flex items-center justify-center overflow-hidden rounded-full border-2 border-base bg-surface-2 text-faint"
  >
    ${dataImage(src)
    ? `<img src="${escapeAttribute(src)}" alt="" class="h-full w-full object-cover">`
    : icon('store', 'size-1/2')}
  </div>`
);

export const shopBanner = (src) => (
  `<div class="relative h-36 w-full overflow-hidden bg-surface-2">
    ${dataImage(src)
    ? `<img src="${escapeAttribute(src)}" class="h-full w-full object-cover" alt="">`
    : `<div class="flex h-full items-center justify-center text-faint">${icon('image', 'size-7')}</div>`}
  </div>`
);

export const hubLink = ({
  href,
  label,
  linkIcon,
  unread,
  chatId,
}) => `<a href="${escapeAttribute(href)}" class="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 text-left transition-colors hover:border-border-strong active:scale-[0.99]">
  <span class="text-accent">${icon(linkIcon, 'size-5')}</span>
  <span class="flex-1 text-[15px] font-medium text-text">${escapeHtml(label)}</span>
  ${unread === undefined && !chatId ? '' : `<span data-unread-dot${chatId ? ` data-chat-id="${escapeAttribute(chatId)}"` : ''} class="${unread ? 'block' : 'hidden'} size-2.5 shrink-0 rounded-full bg-accent" aria-label="Unread messages"></span>`}
  <span class="text-faint">${icon('chevronRight', 'size-4')}</span>
</a>`;

export const richEditor = ({
  value = '',
  label = 'Description',
  name = 'description',
}) => `<div data-rich-editor>
  <div class="mb-2 flex items-center justify-between">
    <span class="text-[12px] font-semibold uppercase tracking-wide text-muted">${escapeHtml(label)}</span>
    <div class="flex items-center gap-1 rounded-xl bg-surface-2 p-1 border border-border">
      <button type="button" data-tab="write" class="rich-tab active rounded-lg px-3 py-1.5 text-[13px] font-semibold text-text transition-colors">
        ${icon('pencil', 'size-3.5')}
        <span>Write</span>
      </button>
      <button type="button" data-tab="preview" class="rich-tab rounded-lg px-3 py-1.5 text-[13px] font-semibold text-muted hover:text-text transition-colors">
        ${icon('eye', 'size-3.5')}
        <span>Preview</span>
      </button>
    </div>
  </div>
  <div class="overflow-hidden rounded-xl border border-border bg-surface-2 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
    <div data-editor-toolbar class="rich-toolbar flex items-center gap-1 border-b border-border p-1.5" aria-label="Text formatting">
      <button type="button" data-bbcode="b" title="Bold" aria-label="Bold">${icon('bold', 'size-4')}</button>
      <button type="button" data-bbcode="i" title="Italic" aria-label="Italic">${icon('italic', 'size-4')}</button>
      <button type="button" data-bbcode="img" title="Image" aria-label="Image">${icon('image', 'size-4')}</button>
      <button type="button" data-bbcode="quote" title="Quote">Quote</button>
    </div>
    <div data-pane="write">
      <textarea rows="6" class="w-full resize-none bg-transparent px-4 py-3 text-[15px] leading-relaxed text-text placeholder:text-faint outline-none" name="${escapeAttribute(name)}" placeholder="Describe it…">${escapeHtml(value)}</textarea>
    </div>
    <div data-pane="preview" class="hidden min-h-[160px] px-4 py-3">
      <div data-rich-preview class="rich-text"></div>
    </div>
  </div>
  <span class="mt-1.5 block text-[12px] text-faint">Insert images with paste or drop</span>
</div>`;

export const photoField = ({
  label,
  name = 'photo',
  value,
  aspect = 'square',
  autoSubmit = false,
}) => `<div class="photo-field" data-photo-field${autoSubmit ? ' data-auto-submit' : ''}>
  <span class="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-muted">${escapeHtml(label)}</span>
  <button type="button" class="photo-picker photo-picker-${escapeAttribute(aspect)}" data-photo-pick>
    ${dataImage(value)
    ? `<img data-photo-preview src="${escapeAttribute(value)}" alt="${escapeAttribute(label)}">`
    : `<span data-photo-placeholder>${icon('image', 'size-6')}<span>Choose or drop image</span></span>`}
  </button>
  <input class="hidden" data-photo-input type="file" name="${escapeAttribute(name)}" accept="image/png,image/jpeg,image/webp,image/gif">
  <span data-photo-name class="mt-1.5 block truncate text-[12px] text-faint">PNG, JPEG, WebP, or GIF (choose or drop)</span>
</div>`;

export const selectCurrency = (value) => `<label class="block">
  <span class="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-muted">Currency</span>
  <select class="h-12 w-full rounded-xl border border-border bg-surface-2 px-4 text-[15px] text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" name="currency" required>
    ${CURRENCIES.map((currency) => (
    `<option value="${currency}" ${currency === String(value).toLowerCase() ? 'selected' : ''}>${currency.toUpperCase()}</option>`
  )).join('')}
  </select>
</label>`;

export const thumb = (src, size = 56) => (
  `<div style="width:${size}px;height:${size}px" class="flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-2 text-faint">
    ${dataImage(src)
    ? `<img src="${escapeAttribute(src)}" alt="" class="h-full w-full object-cover">`
    : icon('image', 'size-5')}
  </div>`
);

export const productPhoto = (src, alt = '') => (
  `<div class="product-photo-full flex w-full items-center justify-center overflow-hidden rounded-2xl bg-surface-2 text-faint">
    ${dataImage(src)
    ? `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}">`
    : icon('image', 'size-8')}
  </div>`
);

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
  return `<span class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.classes}">${status.label}</span>`;
};

export const orderCard = ({ order, href }) => {
  const card = `<article class="space-y-3 rounded-2xl border border-border bg-surface p-4">
    <div class="flex items-center gap-3">
      ${thumb(order.product_photo)}
      <div class="min-w-0 flex-1">
        <p class="truncate text-[15px] font-semibold text-text">${escapeHtml(order.product_name)}</p>
        <p class="text-[13px] text-muted">${Number(order.purchase_quantity)} × ${escapeHtml(formatFiat(order.purchase_price, order.purchase_currency))}</p>
      </div>
      ${orderStatusBadge(order)}
    </div>
    <div class="flex items-center justify-between border-t border-border pt-2.5 text-[12px]">
      <span class="font-mono text-muted">${escapeHtml(formatXmr(order.deposit_amount))} XMR</span>
      <span title="${escapeAttribute(order.created_at)}" class="text-faint">${escapeHtml(formatDate(order.created_at))}</span>
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

export const emptyState = ({
  emptyIcon,
  title,
  description,
}) => `<div class="flex flex-col items-center justify-center px-6 py-16 text-center">
  <div class="mb-4 flex size-14 items-center justify-center rounded-2xl bg-surface-2 text-faint">${icon(emptyIcon, 'size-8')}</div>
  <p class="text-[15px] font-semibold text-text">${escapeHtml(title)}</p>
  <p class="mt-1.5 max-w-[260px] text-[13px] text-muted">${escapeHtml(description)}</p>
</div>`;
