import { escapeAttribute, escapeHtml } from '../utils/html.js';

const ASSET_VERSION = '20260809-2';

export const icon = (name, classes = 'size-5') => {
  const paths = {
    arrowLeft: '<path d="m15 18-6-6 6-6"/>',
    bold: '<path d="M6 4h8a4 4 0 0 1 0 8H6z"/><path d="M6 12h9a4 4 0 0 1 0 8H6z"/>',
    boxes: '<path d="m3 8 9-5 9 5v8l-9 5-9-5Z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    checkCheck: '<path d="m18 6-11 11-5-5"/><path d="m22 10-7.5 7.5L13 16"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    italic: '<line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/>',
    message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
    pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    power: '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>',
    qr: '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
    receipt: '<path d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V2l-2 2-2-2-2 2-2-2-2 2-2-2-2 2Z"/><path d="M16 8h-6"/><path d="M16 12h-6"/><path d="M13 16h-3"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    store: '<path d="M3 9V7l2-4h14l2 4v2"/><path d="M5 13v8h14v-8"/><path d="M9 21v-6h6v6"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>',
    wallet: '<path d="M20 7V6a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v8a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V7"/><path d="M16 14h.01"/>',
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
  status = '',
  titleIcon = '',
  animate = true,
}) => {
  const backButton = back
    ? `<a class="inline-flex size-11 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-2 hover:text-text active:scale-95" href="${escapeAttribute(back)}" aria-label="Back">${icon('arrowLeft', 'size-6')}</a>`
    : '';

  return `<div class="mx-auto flex h-full max-w-[480px] flex-col bg-base${animate ? ' page-enter' : ''}">
  <header class="sticky top-0 z-30 border-b border-border bg-elevated/95 backdrop-blur pt-safe">
    <div class="flex h-14 items-center gap-1 px-2">
      <div class="flex w-11 shrink-0 justify-start">${backButton}</div>
      <h1 class="min-w-0 flex-1 ${back ? 'text-left' : 'text-center'} text-[15px] font-bold text-text">
        <span class="inline-flex max-w-full items-center ${back ? 'justify-start' : 'justify-center'} gap-1.5">
          ${titleIcon ? `<span class="shrink-0 text-accent">${titleIcon}</span>` : ''}
          <span class="truncate">${escapeHtml(title)}</span>
        </span>
      </h1>
      <div class="flex min-w-11 shrink-0 items-center justify-end gap-1.5 pr-1">${status}</div>
    </div>
  </header>
  <main class="no-scrollbar flex-1 overflow-y-auto">${content}</main>
  ${bottom ? `<div class="sticky bottom-0 border-t border-border bg-elevated/95 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] backdrop-blur">${bottom}</div>` : ''}
</div>`;
};

const BUTTON_VARIANTS = {
  danger: 'bg-transparent text-danger border border-danger/40 hover:bg-danger/10',
  ghost: 'bg-transparent text-text hover:bg-surface-2',
  primary: 'bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-press',
  secondary: 'bg-surface-2 text-text border border-border hover:border-border-strong',
};

export const button = ({
  label,
  href,
  type = 'button',
  variant = 'primary',
  buttonIcon = '',
  classes = '',
  attributes = '',
}) => {
  const tag = href ? 'a' : 'button';
  const target = href ? ` href="${escapeAttribute(href)}"` : ` type="${escapeAttribute(type)}"`;

  return `<${tag}${target} class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-semibold transition-colors duration-150 select-none active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 ${BUTTON_VARIANTS[variant]} ${escapeAttribute(classes)}" ${attributes}>${buttonIcon}${escapeHtml(label)}</${tag}>`;
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
