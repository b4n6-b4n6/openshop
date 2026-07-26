import {
  appFrame,
  button,
  document,
  field,
  icon,
  pathFor,
} from '../../shared/pages/layout.js';
import {
  avatar,
  emptyState,
  formatFiat,
  orderCard,
  orderStatus,
  productCard,
  qrView,
  richText,
  shopBanner,
  thumb,
  truncateMiddle,
} from '../../shared/pages/components.js';
import { escapeAttribute, escapeHtml } from '../../shared/utils/html.js';

export const publicShopPage = ({
  shop,
  onion,
  basePath = '',
}) => document({
  title: shop?.name || 'Shop',
  basePath,
  body: appFrame({
    title: 'Shop',
    back: basePath ? '/browse' : '',
    backBasePath: '',
    basePath,
    content: `${shopBanner(shop?.banner_photo?.toString('utf8'))}
      <div class="px-5">
        <div class="relative z-10 -mt-8 mb-3 w-fit">${avatar(shop?.profile_photo?.toString('utf8'))}</div>
        <h2 class="text-xl font-bold text-text">${escapeHtml(shop?.name || 'My Shop')}</h2>
        <p class="mt-1 truncate font-mono text-[12px] text-muted" title="${escapeAttribute(onion)}">${escapeHtml(truncateMiddle(onion))}</p>
        ${shop?.description ? `<div class="mt-3">${richText(shop.description)}</div>` : ''}
        <div class="mb-6 mt-5 flex flex-col gap-2.5">
          ${button({
    label: 'Products',
    href: pathFor(basePath, '/products'),
    icon: icon('boxes', 'size-4'),
  })}
          ${button({
    label: 'Chat',
    href: pathFor(basePath, '/chats'),
    variant: 'secondary',
    icon: icon('message', 'size-4'),
  })}
          ${button({
    label: 'Orders',
    href: pathFor(basePath, '/orders'),
    variant: 'secondary',
    icon: icon('receipt', 'size-4'),
  })}
        </div>
      </div>`,
  }),
});

export const publicProductsPage = ({ products, basePath = '' }) => {
  const content = products.length
    ? `<div class="flex flex-col gap-2.5 px-5 py-5">${products.map((product) => productCard({
      product,
      basePath,
      actionHref: `/products/${product.id}/purchase`,
      actionLabel: 'Purchase',
    })).join('')}</div>`
    : emptyState({ emptyIcon: 'boxes', title: 'No products' });

  return document({
    title: 'Products',
    basePath,
    body: appFrame({
      title: 'Products',
      back: '/',
      basePath,
      content,
    }),
  });
};

export const purchasePage = ({
  product,
  basePath = '',
  error = '',
  quantity = 1,
}) => {
  const available = Number(product.available_quantity);
  const out = available <= 0;
  const photo = product.photo?.toString('utf8');

  return document({
    title: 'Purchase',
    basePath,
    body: `<form method="post" action="${escapeAttribute(pathFor(basePath, `/products/${product.id}/purchase`))}" class="contents">
      ${appFrame({
    title: 'Purchase',
    back: '/products',
    basePath,
    content: `<div class="space-y-5 px-5 py-6">
          ${error ? `<div role="alert" class="rounded-xl border border-danger/35 bg-danger/10 px-4 py-3 text-[13px] text-danger">${escapeHtml(error)}</div>` : ''}
          <div class="flex items-center gap-3">
            ${thumb(photo, 64)}
            <div class="min-w-0">
              <h2 class="text-lg font-bold text-text">${escapeHtml(product.name)}</h2>
              <p class="text-[14px] text-muted">${escapeHtml(formatFiat(product.price, product.currency))}</p>
            </div>
          </div>
          ${product.description ? richText(product.description) : ''}
          <div class="flex items-center justify-between">
            <span class="text-[13px] text-muted">Availability</span>
            ${out
    ? '<span class="rounded-full bg-danger/15 px-2 py-0.5 text-[11px] font-semibold text-danger">Out of stock</span>'
    : `<span class="text-[13px] text-text">${available} in stock</span>`}
          </div>
          ${field({
    label: 'Purchase quantity',
    name: 'quantity',
    value: quantity,
    type: 'number',
    attributes: `required min="1" max="${available}" step="1" inputmode="numeric" ${out ? 'disabled' : ''}`,
  })}
        </div>`,
    bottom: button({
      label: out ? 'Out of stock' : 'Purchase',
      type: 'submit',
      attributes: out ? 'disabled' : '',
    }),
  })}
    </form>`,
  });
};

export const ordersPage = ({ orders, basePath = '' }) => document({
  title: 'Orders',
  basePath,
  body: appFrame({
    title: 'Orders',
    back: '/',
    basePath,
    content: orders.length
      ? `<div class="flex flex-col gap-2.5 px-5 py-5">${orders.map((order) => orderCard({
        order,
        href: pathFor(basePath, `/orders/${order.id}`),
      })).join('')}</div>`
      : emptyState({
        emptyIcon: 'receipt',
        title: 'No orders yet',
        description: 'Your purchases will appear here.',
      }),
  }),
});

export const orderPage = ({
  order,
  qr,
  basePath = '',
}) => {
  const status = orderStatus(order);
  const amount = (Number(order.deposit_amount) / 1e12)
    .toFixed(12)
    .replace(/0+$/, '')
    .replace(/\.$/, '');

  return document({
    title: 'Order',
    basePath,
    scripts: ['qr.js'],
    refresh: order.confirmed_deposit_at ? undefined : '10',
    body: appFrame({
      title: 'Order',
      back: '/orders',
      basePath,
      content: `<div class="space-y-4 px-5 py-6">
        <div class="flex items-center justify-between">
          <h2 class="text-[15px] font-semibold text-text">${escapeHtml(order.product_name)}</h2>
          <span class="rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.classes}">${status.label}</span>
        </div>
        <div class="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-4 text-center">
          <div>
            <p class="font-mono text-3xl font-bold text-text">${escapeHtml(amount)}</p>
            <p class="mt-0.5 text-[13px] text-muted">XMR</p>
          </div>
          ${qrView({
    qr,
    caption: order.deposit_address,
    fileName: 'openshop-payment-qr.png',
    size: 168,
    basePath,
  })}
          <div class="w-full">
            <p class="mb-1 text-[12px] font-semibold uppercase tracking-wide text-muted">Pay to this address</p>
            <p class="break-all rounded-xl border border-border bg-surface-2 p-3 text-left font-mono text-[12px] text-text">${escapeHtml(order.deposit_address)}</p>
          </div>
        </div>
        <p class="text-center text-[12px] leading-relaxed text-faint">Send exactly this amount in Monero. The status refreshes automatically after the deposit is detected and confirmed.</p>
      </div>`,
      bottom: button({
        label: 'View my orders',
        href: pathFor(basePath, '/orders'),
        variant: 'secondary',
      }),
    }),
  });
};
