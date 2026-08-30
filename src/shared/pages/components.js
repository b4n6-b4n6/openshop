import dataImage from '../utils/dataImage.js';
import { escapeAttribute, escapeHtml } from '../utils/html.js';
import { icon } from './layout.js';

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

export const thumb = (src, size = 56) => (
  `<div
    style="width:${size}px; height: ${size}px;"
    class="flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-2 text-faint"
  >
    ${
      dataImage(src)
        ? `<img src="${escapeAttribute(src)}" alt="" class="h-full w-full object-cover">`
        : icon('image', 'size-5')
    }
  </div>`
);

export const emptyState = ({
  emptyIcon,
  title,
  description,
}) => (
  `<div class="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div class="mb-4 flex size-14 items-center justify-center rounded-2xl bg-surface-2 text-faint">${icon(emptyIcon, 'size-8')}</div>
    <p class="text-[15px] font-semibold text-text">${escapeHtml(title)}</p>
    <p class="mt-1.5 max-w-[260px] text-[13px] text-muted">${escapeHtml(description)}</p>
  </div>`
);
