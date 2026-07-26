import {
  appFrame,
  button,
  document,
  errorNotice,
  field,
  icon,
} from '../../shared/pages/layout.js';
import {
  avatar,
  emptyState,
  formatFiat,
  hubLink,
  photoInput,
  productCard,
  qrView,
  richEditor,
  richText,
  selectCurrency,
  shopBanner,
  truncateMiddle,
} from '../../shared/pages/components.js';
import { escapeAttribute, escapeHtml } from '../../shared/utils/html.js';

const page = (options) => document(options);

export const welcomePage = () => page({
  title: 'Welcome',
  body: `<div class="mx-auto flex h-full max-w-[480px] flex-col bg-base px-6 page-enter">
    <div class="flex flex-1 flex-col items-center justify-center gap-8 pb-16 text-center">
      <div class="flex flex-col items-center gap-5">
        <img src="/static/images/logo-orange.svg" alt="" width="92" height="92" class="welcome-logo">
        <div class="space-y-1.5">
          <h1 class="text-3xl font-extrabold tracking-tight text-text">OpenShop</h1>
          <p class="max-w-[16rem] text-[14px] text-muted">Spin up your own Monero shop, or browse one by its onion address.</p>
        </div>
      </div>
      <div class="flex w-full max-w-xs flex-col gap-3">
        ${button({ label: 'Open New Shop', href: '/create' })}
        ${button({ label: 'Browse Shop', href: '/browse', variant: 'secondary' })}
      </div>
    </div>
  </div>`,
});

export const browsePage = ({ onion = '', error = '' } = {}) => page({
  title: 'Browse Shop',
  scripts: ['browse.js'],
  body: `<form method="post" action="/browse" class="contents">
    ${appFrame({
    title: 'Browse Shop',
    back: '/welcome',
    content: `<div class="space-y-5 px-5 py-6">
        ${error ? errorNotice(error, 'Could not connect') : ''}
        <p class="text-[14px] text-muted">Paste the shop&apos;s onion address to connect over Tor.</p>
        ${field({
    label: 'Shop address',
    name: 'onion',
    value: onion,
    placeholder: 'xxxxxxxx…onion',
    mono: true,
    error: error && !onion ? 'Enter a shop address' : '',
    attributes: 'autofocus required autocapitalize="none" autocomplete="off" spellcheck="false"',
  })}
        <button type="button" data-scan-qr class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-5 text-[15px] font-semibold text-text transition-colors hover:border-border-strong active:scale-[0.99]">
          ${icon('qr', 'size-4')}Scan QR code
        </button>
        <input data-qr-file type="file" accept="image/*" capture="environment" class="hidden">
        <p data-qr-error role="alert" class="hidden text-[13px] text-danger"></p>
      </div>`,
    bottom: button({ label: 'Enter', type: 'submit' }),
  })}
  </form>`,
});

export const browseErrorPage = (message) => page({
  title: 'Connection Error',
  body: appFrame({
    title: 'Connection Error',
    back: '/browse',
    content: `<div class="flex h-full flex-col items-center justify-center px-6 pb-16 text-center">
      <div class="mb-4 flex size-14 items-center justify-center rounded-2xl bg-danger/15 text-danger">
        <span class="text-2xl font-bold">!</span>
      </div>
      <p class="text-[12px] font-semibold uppercase tracking-wide text-danger">Error</p>
      <h2 class="mt-2 text-lg font-bold text-text">Could not connect</h2>
      <p class="mt-2 max-w-[260px] text-[13px] leading-relaxed text-muted">${escapeHtml(message)}</p>
      <div class="mt-6 w-full max-w-xs">${button({ label: 'Back', href: '/browse', variant: 'secondary' })}</div>
    </div>`,
  }),
});

export const createShopPage = ({ values = {}, errors = {}, error = '' } = {}) => page({
  title: 'Open New Shop',
  body: `<form method="post" action="/create" class="contents">
    ${appFrame({
    title: 'Open New Shop',
    back: '/welcome',
    content: `<div class="space-y-5 px-5 py-6">
        ${error ? errorNotice(error, 'Could not open shop') : ''}
        <p class="text-[14px] text-muted">Import a <span class="text-text">view-only</span> Monero wallet. Your spend key never leaves your device.</p>
        ${field({
    label: 'Monero wallet primary address',
    name: 'primaryAddress',
    value: values.primaryAddress,
    placeholder: '4…',
    mono: true,
    error: errors.primaryAddress,
    attributes: 'required autocapitalize="none" autocomplete="off" spellcheck="false"',
  })}
        ${field({
    label: 'Private view key',
    name: 'privateViewKey',
    value: values.privateViewKey,
    placeholder: 'secret view key',
    mono: true,
    error: errors.privateViewKey,
    attributes: 'required autocapitalize="none" autocomplete="off" spellcheck="false"',
  })}
        ${field({
    label: 'Restore block height',
    name: 'restoreHeight',
    value: values.restoreHeight,
    placeholder: 'e.g. 3155600',
    error: errors.restoreHeight,
    attributes: 'required inputmode="numeric" pattern="[0-9]+"',
  })}
      </div>`,
    bottom: button({ label: 'Create', type: 'submit' }),
  })}
  </form>`,
});

export const openingPage = ({ state, message, progress = 0 }) => page({
  title: 'Opening Shop',
  refresh: state === 'ready' || state === 'error' ? undefined : '2',
  body: appFrame({
    title: 'Opening Shop',
    content: `<div class="flex h-full flex-col items-center justify-center px-6 pb-16 text-center">
      ${state === 'error'
    ? '<div class="mb-5 flex size-14 items-center justify-center rounded-full bg-danger/15 text-2xl font-bold text-danger">!</div>'
    : '<div class="mb-5 size-12 animate-spin rounded-full border-[3px] border-border-strong border-t-accent"></div>'}
      <h2 class="text-lg font-bold text-text">${state === 'error' ? 'Shop could not open' : 'Opening your shop…'}</h2>
      <p class="mt-2 max-w-[260px] text-[13px] leading-relaxed text-muted">${escapeHtml(message)}</p>
      ${progress ? `<div class="mt-5 h-1 w-56 overflow-hidden rounded-full bg-surface-2"><div class="h-full rounded-full bg-accent transition" style="width:${Math.min(100, Math.max(0, Number(progress)))}%"></div></div>` : ''}
      ${state === 'error' ? `<div class="mt-6 w-full max-w-xs">${button({ label: 'Back', href: '/create', variant: 'secondary' })}</div>` : ''}
    </div>`,
  }),
});

export const ownerShopPage = ({
  shop,
  onion,
  qr,
  hasUnread = false,
}) => page({
  title: 'My Shop',
  scripts: ['sound.js', 'owner-notifications.js', 'qr.js'],
  body: appFrame({
    title: 'My Shop',
    content: `${shopBanner(shop?.banner_photo?.toString('utf8'))}
      <div class="px-5">
        <div class="relative z-10 -mt-8 mb-3 w-fit">${avatar(shop?.profile_photo?.toString('utf8'))}</div>
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <h2 class="truncate text-xl font-bold text-text">${escapeHtml(shop?.name || 'My Shop')}</h2>
            <p class="mt-1 truncate font-mono text-[12px] text-muted" title="${escapeAttribute(onion)}">${escapeHtml(truncateMiddle(onion))}</p>
          </div>
          ${qr ? qrView({
    qr,
    caption: onion,
    fileName: 'openshop-shop-qr.png',
    size: 64,
  }) : ''}
        </div>
        ${shop?.description
    ? `<div class="mt-3">${richText(shop.description)}</div>`
    : '<p class="mt-3 text-[14px] text-faint">No description yet. Tap “Edit shop” to add one.</p>'}
        <div class="mt-5 grid grid-cols-2 gap-2.5">
          ${button({
    label: 'Edit shop',
    href: '/shop/edit',
    variant: 'secondary',
    icon: icon('pencil', 'size-4'),
  })}
          ${button({
    label: 'Products',
    href: '/shop/products',
    variant: 'secondary',
    icon: icon('boxes', 'size-4'),
  })}
        </div>
        <div class="mt-3 flex flex-col gap-2.5">
          ${hubLink({ href: '/shop/orders', label: 'View my orders', linkIcon: 'receipt' })}
          ${hubLink({
    href: '/shop/chats',
    label: 'View my chats',
    linkIcon: 'message',
    unread: hasUnread,
  })}
        </div>
        <div class="my-6"></div>
      </div>`,
  }),
});

export const editShopPage = ({ shop, error = '' }) => page({
  title: 'Edit Shop',
  scripts: ['sound.js', 'owner-notifications.js', 'editor.js'],
  body: `<form method="post" action="/shop/edit" enctype="multipart/form-data" class="contents">
    ${appFrame({
    title: 'Edit Shop',
    back: '/shop',
    content: `<div class="space-y-5 px-5 py-6">
        ${error ? errorNotice(error, 'Shop was not updated') : ''}
        ${field({
    label: 'Shop name',
    name: 'name',
    value: shop?.name,
    placeholder: 'My Shop',
    attributes: 'required maxlength="120"',
  })}
        ${richEditor({ value: shop?.description, label: 'Shop description' })}
        ${photoInput({ label: 'Profile photo', name: 'profilePhoto' })}
        ${photoInput({ label: 'Banner photo', name: 'bannerPhoto' })}
      </div>`,
    bottom: button({ label: 'Update', type: 'submit' }),
  })}
  </form>`,
});

export const productsPage = ({ products, owner = true, basePath = '' }) => {
  const content = products.length === 0
    ? emptyState({
      emptyIcon: 'boxes',
      title: owner ? 'No products yet' : 'No products',
      description: owner ? 'Add your first product to start selling.' : '',
    })
    : `<div class="flex flex-col gap-2.5 px-5 py-5">${products.map((product) => productCard({
      product,
      basePath,
      actionHref: owner
        ? `/shop/products/${product.id}/edit`
        : `/products/${product.id}/purchase`,
      actionLabel: owner ? 'Edit' : 'Purchase',
    })).join('')}</div>`;

  return page({
    title: owner ? 'My Products' : 'Products',
    basePath,
    scripts: owner ? ['sound.js', 'owner-notifications.js'] : [],
    body: appFrame({
      title: owner ? 'My Products' : 'Products',
      back: owner ? '/shop' : '/',
      basePath,
      content,
      bottom: owner
        ? button({
          label: 'Add new product',
          href: '/shop/products/new',
          icon: icon('plus', 'size-4'),
        })
        : '',
    }),
  });
};

export const productFormPage = ({
  product = {},
  edit = false,
  error = '',
}) => page({
  title: edit ? 'Edit Product' : 'Add Product',
  scripts: ['sound.js', 'owner-notifications.js', 'editor.js'],
  body: `<form method="post" action="${edit ? `/shop/products/${escapeAttribute(product.id)}/edit` : '/shop/products/new'}" enctype="multipart/form-data" class="contents">
    ${appFrame({
    title: edit ? 'Edit Product' : 'Add Product',
    back: '/shop/products',
    content: `<div class="space-y-5 px-5 py-6">
        ${error ? errorNotice(error, edit ? 'Product was not updated' : 'Product was not added') : ''}
        ${field({
    label: 'Name',
    name: 'name',
    value: product.name,
    placeholder: 'Product name',
    attributes: 'required maxlength="160"',
  })}
        ${richEditor({ value: product.description })}
        ${photoInput({ label: 'Product cover photo', name: 'photo' })}
        ${selectCurrency(product.currency)}
        ${field({
    label: 'Price',
    name: 'price',
    value: product.price,
    placeholder: '0.00',
    type: 'number',
    attributes: 'required min="0.01" max="999.99" step="0.01" inputmode="decimal"',
  })}
        ${field({
    label: 'Quantity',
    name: 'quantity',
    value: product.available_quantity ?? product.quantity ?? 1,
    placeholder: '1',
    type: 'number',
    attributes: 'required min="0" step="1" inputmode="numeric"',
  })}
      </div>`,
    bottom: button({ label: edit ? 'Update' : 'Add', type: 'submit' }),
  })}
  </form>`,
});

export const simpleListPage = ({
  title,
  back,
  content,
  empty,
}) => page({
  title,
  scripts: ['sound.js', 'owner-notifications.js'],
  body: appFrame({
    title,
    back,
    content: content || emptyState(empty),
  }),
});

export const priceLabel = formatFiat;
