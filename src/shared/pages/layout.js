import { escapeAttribute, escapeHtml } from '../utils/html.js';

const ASSET_VERSION = '20260801-1';

export const icon = (name, classes = 'size-5') => {
  const paths = {
    arrowLeft: '<path d="m15 18-6-6 6-6"/>',
    qr: '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
    wifiOff: '<path d="M12 20h.01"/><path d="M8.5 16.43a5 5 0 0 1 7 0"/><path d="M5 12.86a10 10 0 0 1 5.17-2.69"/><path d="M19 12.86a10 10 0 0 0-2.01-1.52"/><path d="M2 8.82a15 15 0 0 1 4.18-2.64"/><path d="M22 8.82a15 15 0 0 0-11.29-3.76"/><path d="m2 2 20 20"/>',
  };

  return `<svg class="${escapeAttribute(classes)}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? ''}</svg>`;
};

export const document = ({
  title = 'OpenShop',
  body,
  scripts = [],
  refresh,
}) => {
  const refreshTag = refresh
    ? `<meta http-equiv="refresh" content="${escapeAttribute(refresh)}">`
    : '';
  const scriptTags = scripts.map(
    (src) => `<script src="/static/${escapeAttribute(src)}?v=${ASSET_VERSION}" defer></script>`,
  ).join('');

  return `<!doctype html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#0f1115">
  ${refreshTag}
  <title>${escapeHtml(title)} · OpenShop</title>
  <link rel="icon" href="/static/images/logo-orange.svg">
  <link rel="stylesheet" href="/static/app.css?v=${ASSET_VERSION}">
  <link rel="stylesheet" href="/static/ssr.css?v=${ASSET_VERSION}">
  ${scriptTags}
</head>
<body>${body}</body>
</html>`;
};

export const appFrame = ({
  title,
  back,
  content,
  bottom,
}) => {
  const backButton = back
    ? `<a class="inline-flex size-11 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-2 hover:text-text active:scale-95" href="${escapeAttribute(back)}" aria-label="Back">${icon('arrowLeft', 'size-6')}</a>`
    : '';

  return `<div class="mx-auto flex h-full max-w-[480px] flex-col bg-base page-enter">
  <header class="sticky top-0 z-30 border-b border-border bg-elevated/95 backdrop-blur pt-safe">
    <div class="flex h-14 items-center gap-1 px-2">
      <div class="flex w-11 justify-start">${backButton}</div>
      <h1 class="flex-1 truncate text-center text-[15px] font-bold text-text">${escapeHtml(title)}</h1>
      <div class="min-w-11"></div>
    </div>
  </header>
  <main class="no-scrollbar flex-1 overflow-y-auto">${content}</main>
  ${bottom ? `<div class="sticky bottom-0 border-t border-border bg-elevated/95 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] backdrop-blur">${bottom}</div>` : ''}
</div>`;
};

const BUTTON_VARIANTS = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-press',
  secondary: 'bg-surface-2 text-text border border-border hover:border-border-strong',
};

export const button = ({
  label,
  href,
  type = 'button',
  variant = 'primary',
  buttonIcon = '',
  attributes = '',
}) => {
  const tag = href ? 'a' : 'button';
  const target = href ? ` href="${escapeAttribute(href)}"` : ` type="${escapeAttribute(type)}"`;

  return `<${tag}${target} class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-semibold transition-colors duration-150 select-none active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 ${BUTTON_VARIANTS[variant]}" ${attributes}>${buttonIcon}${escapeHtml(label)}</${tag}>`;
};

export const field = ({
  label,
  name,
  value = '',
  placeholder = '',
  mono = false,
  error = '',
  attributes = '',
}) => `<label class="block">
  <span class="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-muted">${escapeHtml(label)}</span>
  <input class="h-12 w-full rounded-xl bg-surface-2 border ${error ? 'border-danger focus:border-danger focus:ring-danger/30' : 'border-border focus:border-accent focus:ring-accent/30'} px-4 text-[15px] text-text placeholder:text-faint transition-colors outline-none focus:ring-2 ${mono ? 'font-mono text-[13px]' : ''}" name="${escapeAttribute(name)}" value="${escapeAttribute(value)}" placeholder="${escapeAttribute(placeholder)}" ${attributes}>
  ${error ? `<span class="mt-1.5 block text-[13px] text-danger">${escapeHtml(error)}</span>` : ''}
</label>`;

export const errorNotice = (message, title = 'Something went wrong') => `
<div role="alert" class="rounded-2xl border border-danger/35 bg-danger/10 p-4">
  <p class="text-[15px] font-semibold text-danger">${escapeHtml(title)}</p>
  <p class="mt-1.5 text-[13px] leading-relaxed text-muted">${escapeHtml(message)}</p>
</div>`;

export const logo = (size = 92) => `<img src="/static/images/logo-orange.svg" alt="OpenShop" width="${size}" height="${size}" style="--logo-size:${size}px" class="welcome-logo">`;
