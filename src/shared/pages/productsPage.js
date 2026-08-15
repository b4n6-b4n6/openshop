import { emptyState, thumb } from './components.js';
import {
  appFrame,
  button,
  document,
  icon,
} from './layout.js';
import formatFiat from '../utils/formatFiat.js';
import { escapeHtml } from '../utils/html.js';

const productCard = ({
  product,
  actionHref,
  actionLabel,
}) => {
  const quantity = Number(product.available_quantity);
  const out = quantity <= 0;
  const purchase = actionLabel === 'Purchase';

  return `<article class="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 ${out ? 'opacity-60' : ''}">
    ${thumb(product.photo)}
    <div class="min-w-0 flex-1">
      <p class="truncate text-[15px] font-semibold text-text">${escapeHtml(product.name)}</p>
      <p class="text-[13px] text-muted">${escapeHtml(formatFiat(product.price, product.currency))}</p>
      <div class="mt-1">${out
    ? '<span class="inline-flex rounded-full bg-danger/15 px-2 py-0.5 text-[11px] font-semibold text-danger">Out of stock</span>'
    : `<span class="text-[12px] text-faint">${quantity} in stock</span>`}
      </div>
    </div>
    <div class="shrink-0">${button({
    label: actionLabel,
    href: purchase && out ? undefined : actionHref,
    variant: purchase ? 'primary' : 'secondary',
    classes: 'h-9 px-3 text-[13px]',
    attributes: purchase && out ? 'disabled aria-label="Out of stock"' : '',
  })}</div>
  </article>`;
};

export const products = ({
  allProducts, owner, root,
}) => (
  allProducts.length
    ? (
      `<div class="flex flex-col gap-2.5 px-5 py-5">
      ${allProducts.map((product) => productCard({
        product,
        actionHref: `${root}/${product.id}`,
        actionLabel: owner ? 'Edit' : 'Purchase',
      })).join('')}
      </div>`
    ) : (
      emptyState({
        emptyIcon: 'boxes',
        ...(
          owner
            ? {
              title: 'No products yet',
              description: 'Add your first product to start selling.',
            }
            : {
              title: 'No products',
              description: 'This shop has not listed any products yet.',
            }
        ),
      })
    )
);

const getTitle = (owner) => (
  owner ? 'My Products' : 'Products'
);

export const productsPage = ({
  allProducts, owner, status = '',
}) => document({
  title: getTitle(owner),
  scripts: ['sound.js'],
  body: appFrame({
    title: getTitle(owner),
    titleIcon: icon('boxes', 'size-4'),
    back: owner ? '/shop' : '/browser/',
    status,
    content: products({
      allProducts,
      owner,
      root: owner ? '/shop/products' : '/browser/products',
    }),
    bottom: owner && button({
      label: 'Add new product',
      href: '/shop/products/new',
      buttonIcon: icon('plus', 'size-4'),
    }),
  }),
});
