import { CURRENCIES } from '../../const.js';
import { renderBbcode } from '../utils/bbcode.js';
import { escapeAttribute, escapeHtml } from '../utils/html.js';
import { isSafeDataImage } from '../utils/uploads.js';
import {
  button,
  icon,
  pathFor,
} from './layout.js';

export const truncateMiddle = (value, head = 10, tail = 10) => {
  const text = String(value ?? '');
  return text.length <= head + tail + 1
    ? text
    : `${text.slice(0, head)}…${text.slice(-tail)}`;
};

export const formatFiat = (amount, currency) => {
  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: String(currency ?? 'USD').toUpperCase(),
      maximumFractionDigits: 2,
    }).format(Number(amount));
  } catch {
    return `${Number(amount).toFixed(2)} ${String(currency ?? '').toUpperCase()}`;
  }
};

export const richText = (description) => (
  `<div class="rich-text">${renderBbcode(description)}</div>`
);

export const avatar = (src, size = 72) => `<div style="width:${size}px;height:${size}px" class="flex items-center justify-center overflow-hidden rounded-full border-2 border-base bg-surface-2 text-faint">
  ${isSafeDataImage(src)
    ? `<img src="${escapeAttribute(src)}" alt="" class="h-full w-full object-cover">`
    : icon('store', 'size-1/2')}
</div>`;

export const shopBanner = (src) => `<div class="relative h-36 w-full overflow-hidden bg-surface-2">
  ${isSafeDataImage(src)
    ? `<img src="${escapeAttribute(src)}" alt="" class="h-full w-full object-cover">`
    : `<div class="flex h-full items-center justify-center text-faint">${icon('image', 'size-7')}</div>`}
</div>`;

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

export const photoInput = ({
  label,
  name,
  hint = 'PNG, JPEG, WebP, or GIF · max 2 MB',
}) => `<label class="block">
  <span class="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-muted">${escapeHtml(label)}</span>
  <input class="photo-input w-full rounded-xl border border-border bg-surface-2 p-3 text-[13px] text-muted" type="file" name="${escapeAttribute(name)}" accept="image/png,image/jpeg,image/webp,image/gif">
  <span class="mt-1.5 block text-[12px] text-faint">${escapeHtml(hint)}</span>
</label>`;

export const selectCurrency = (value = 'USD') => `<label class="block">
  <span class="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-muted">Currency</span>
  <select class="h-12 w-full rounded-xl border border-border bg-surface-2 px-4 text-[15px] text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" name="currency">
    ${CURRENCIES.map((currency) => {
    const upper = currency.toUpperCase();
    return `<option value="${upper}" ${upper === String(value).toUpperCase() ? 'selected' : ''}>${upper}</option>`;
  }).join('')}
  </select>
</label>`;

export const richEditor = ({
  value = '',
  label = 'Description',
  name = 'description',
}) => `<div data-rich-editor>
  <span class="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-muted">${escapeHtml(label)}</span>
  <div class="overflow-hidden rounded-xl border border-border bg-surface-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
    <div class="rich-toolbar flex items-center gap-1 border-b border-border p-1.5" aria-label="Text formatting">
      <button type="button" data-bbcode="b" title="Bold" aria-label="Bold">${icon('bold', 'size-4')}</button>
      <button type="button" data-bbcode="i" title="Italic" aria-label="Italic">${icon('italic', 'size-4')}</button>
      <button type="button" data-bbcode="quote" title="Quote">Quote</button>
      <button type="button" data-add-image title="Insert photos" aria-label="Insert photos">${icon('image', 'size-4')}</button>
    </div>
    <textarea rows="6" class="w-full resize-none bg-transparent px-4 py-3 text-[15px] leading-relaxed text-text placeholder:text-faint outline-none" name="${escapeAttribute(name)}" placeholder="Describe it… Use the toolbar for rich text and photos.">${escapeHtml(value)}</textarea>
  </div>
  <input class="hidden" data-inline-images type="file" name="inlineImages" accept="image/png,image/jpeg,image/webp,image/gif" multiple>
  <span class="mt-1.5 block text-[12px] text-faint">Rich text is stored as BBCode. Up to 5 inline images, 2 MB each.</span>
</div>`;

export const thumb = (src, size = 56) => `<div style="width:${size}px;height:${size}px" class="flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-2 text-faint">
  ${isSafeDataImage(src)
    ? `<img src="${escapeAttribute(src)}" alt="" class="h-full w-full object-cover">`
    : icon('image', 'size-5')}
</div>`;

export const productCard = ({
  product,
  actionHref,
  actionLabel,
  basePath = '',
}) => {
  const out = Number(product.available_quantity ?? product.quantity) <= 0;
  const quantity = Number(product.available_quantity ?? product.quantity);
  let photo;
  if (Buffer.isBuffer(product.photo)) {
    photo = product.photo.toString('utf8');
  } else if (typeof product.photo === 'string') {
    photo = product.photo;
  }
  let action = '';
  if (actionHref && out && actionLabel === 'Purchase') {
    action = button({
      label: actionLabel,
      variant: 'primary',
      classes: 'h-9 px-3 text-[13px]',
      attributes: 'disabled',
    });
  } else if (actionHref) {
    action = button({
      label: actionLabel,
      href: pathFor(basePath, actionHref),
      variant: actionLabel === 'Purchase' ? 'primary' : 'secondary',
      classes: 'h-9 px-3 text-[13px]',
    });
  }

  return `<div class="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 ${out ? 'opacity-60' : ''}">
    ${thumb(photo)}
    <div class="min-w-0 flex-1">
      <p class="truncate text-[15px] font-semibold text-text">${escapeHtml(product.name)}</p>
      <p class="text-[13px] text-muted">${escapeHtml(formatFiat(product.price, product.currency))}</p>
      <div class="mt-1">${out
    ? '<span class="inline-flex rounded-full bg-danger/15 px-2 py-0.5 text-[11px] font-semibold text-danger">Out of stock</span>'
    : `<span class="text-[12px] text-faint">${quantity} in stock</span>`}</div>
    </div>
    ${action ? `<div class="shrink-0">${action}</div>` : ''}
  </div>`;
};

export const emptyState = ({
  emptyIcon,
  title,
  description = '',
}) => `<div class="flex flex-col items-center justify-center px-6 py-16 text-center">
  <div class="mb-4 flex size-14 items-center justify-center rounded-2xl bg-surface-2 text-faint">${icon(emptyIcon, 'size-8')}</div>
  <p class="text-[15px] font-semibold text-text">${escapeHtml(title)}</p>
  ${description ? `<p class="mt-1.5 max-w-[260px] text-[13px] text-muted">${escapeHtml(description)}</p>` : ''}
</div>`;

export const orderStatus = (order) => {
  if (order.confirmed_deposit_at) {
    return {
      label: 'Confirmed',
      classes: 'bg-success/15 text-success',
    };
  }
  if (order.detected_deposit_at) {
    return {
      label: 'Detected',
      classes: 'bg-warning/15 text-warning',
    };
  }
  return {
    label: 'Pending',
    classes: 'bg-surface-2 text-muted',
  };
};

export const orderCard = ({ order, href = '' }) => {
  const status = orderStatus(order);
  const card = `<div class="space-y-3 rounded-2xl border border-border bg-surface p-4">
    <div class="flex items-center gap-3">
      ${thumb(order.product_photo?.toString('utf8'))}
      <div class="min-w-0 flex-1">
        <p class="truncate text-[15px] font-semibold text-text">${escapeHtml(order.product_name)}</p>
        <p class="text-[13px] text-muted">${Number(order.purchase_quantity)} × · ${escapeHtml(formatFiat(order.purchase_price, order.purchase_currency))}</p>
      </div>
      <span class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.classes}">${status.label}</span>
    </div>
    <div class="flex items-center justify-between border-t border-border pt-2.5 text-[12px]">
      <span class="font-mono text-muted">${(Number(order.deposit_amount ?? 0) / 1e12).toFixed(12).replace(/0+$/, '').replace(/\.$/, '')} XMR</span>
      <span class="text-faint">${new Date(order.created_at).toLocaleDateString()}</span>
    </div>
  </div>`;
  return href
    ? `<a class="block active:scale-[0.99]" href="${escapeAttribute(href)}">${card}</a>`
    : card;
};

export const messageBubble = ({ message, me }) => {
  const own = message.sender === me;
  const media = message.image_content?.toString('utf8');
  let content;
  if (media && isSafeDataImage(media)) {
    content = `<button type="button" data-chat-image class="block overflow-hidden rounded-xl" aria-label="View attached image">
      <img src="${escapeAttribute(media)}" alt="Image attachment" class="max-h-48 w-full object-contain">
    </button>`;
  } else if (media) {
    content = '<span class="text-[13px] text-danger">Invalid image attachment</span>';
  } else {
    content = `<p class="whitespace-pre-wrap break-words text-[14px]">${escapeHtml(message.text_content)}</p>`;
  }

  return `<div data-message-id="${escapeAttribute(message.id)}" class="flex ${own ? 'justify-end' : 'justify-start'}">
    <div class="max-w-[82%] rounded-2xl px-3 py-2 ${own ? 'bg-accent text-on-accent' : 'border border-border bg-surface text-text'}">
      ${content}
      <span class="mt-1 block text-[10px] ${own ? 'text-on-accent/70' : 'text-faint'}">${new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
  </div>`;
};
