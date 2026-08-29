import {
  productPhoto,
  richText,
} from '../../shared/pages/components.js';
import {
  appFrame,
  button,
  document,
  icon,
} from '../../shared/pages/layout.js';
import { escapeAttribute, escapeHtml } from '../../shared/utils/html.js';
import formatFiat from '../../shared/utils/formatFiat.js';

const productPage = ({
  id,
  name,
  photo,
  description,
  price,
  currency,
  available_quantity,
}) => {
  const quantity = Number(available_quantity);
  const out = quantity <= 0;
  const action = `/browser/products/${encodeURIComponent(id)}`;

  return document({
    title: 'Purchase',
    scripts: ['customer.js'],
    body: appFrame({
      title: 'Purchase',
      titleIcon: icon('boxes', 'size-4'),
      back: '/browser/products',
      content: (
        `<form
          id="purchase-form"
          data-purchase-form
          data-unit-price="${escapeAttribute(price)}"
          data-currency="${escapeAttribute(currency)}"
          action="${escapeAttribute(action)}"
          method="post"
          class="space-y-5 px-5 py-6"
        >
          ${productPhoto(photo, name)}
          <div>
            <h2 class="text-lg font-bold text-text">${escapeHtml(name)}</h2>
            <p class="mt-1 text-[14px] text-muted">${escapeHtml(formatFiat(price, currency))}</p>
          </div>

          ${description ? richText(description) : ''}

          <div class="flex items-center justify-between gap-3">
            <span class="text-[13px] text-muted">Availability</span>

            ${out
              ? '<span class="inline-flex rounded-full bg-danger/15 px-2 py-0.5 text-[11px] font-semibold text-danger">Out of stock</span>'
              : `<span class="text-[13px] text-text">${quantity} in stock</span>`
            }
          </div>

          ${!out ? `<div class="flex items-center justify-between gap-3">
            <label for="purchase-quantity" class="text-[13px] text-muted">Purchase quantity</label>
            <div class="flex h-10 items-center rounded-xl border border-border bg-surface-2">
              <button
                type="button"
                data-quantity-decrease
                class="inline-flex size-10 items-center justify-center rounded-xl text-muted hover:text-text"
                aria-label="Decrease quantity"
              >−</button>
              <input
                id="purchase-quantity"
                data-purchase-quantity
                class="purchase-quantity h-10 text-[14px] font-semibold text-text outline-none"
                name="purchase_quantity"
                type="number"
                value="1"
                min="1"
                max="${quantity}"
                required
              >
              <button
                type="button"
                data-quantity-increase
                class="inline-flex size-10 items-center justify-center rounded-xl text-muted hover:text-text"
                aria-label="Increase quantity"
              >+</button>
            </div>
          </div>` : ''}
        </form>`
      ),
      bottom: button({
        label: out ? 'Out of stock' : `Purchase · ${formatFiat(price, currency)}`,
        type: 'submit',
        buttonIcon: out ? '' : icon('receipt', 'size-4'),
        attributes: `form="purchase-form"${out ? ' disabled' : ''}`,
      }),
    }),
  });
};

export default productPage;
