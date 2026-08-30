import dataImage from '../utils/dataImage.js';
import { escapeAttribute, escapeHtml } from '../utils/html.js';
import { icon } from './layout.js';

export default ({
  label,
  name = 'photo',
  value,
  aspect = 'square',
  autoSubmit = false,
}) => (
  `<div class="photo-field" data-photo-field${autoSubmit ? ' data-auto-submit' : ''}>
    <span
      class="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-muted"
    >${escapeHtml(label)}</span>

    <button
      type="button"
      class="photo-picker photo-picker-${escapeAttribute(aspect)}"
      data-photo-pick
    >
      ${dataImage(value)
      ? `<img data-photo-preview src="${escapeAttribute(value)}" alt="${escapeAttribute(label)}">`
      : `<span data-photo-placeholder>${icon('image', 'size-6')}<span>Choose or drop image</span></span>`}
    </button>

    <input
      class="hidden"
      data-photo-input
      type="file"
      name="${escapeAttribute(name)}"
      accept="image/png,image/jpeg,image/webp,image/gif"
    >

    <span
      data-photo-name
      class="mt-1.5 block truncate text-[12px] text-faint"
    >PNG, JPEG, WebP, or GIF (choose or drop)</span>
  </div>`
);
