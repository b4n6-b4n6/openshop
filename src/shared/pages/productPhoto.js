import { icon } from './layout.js';
import { escapeAttribute } from '../utils/html.js';
import dataImage from '../utils/dataImage.js';

export default (src, alt = '') => (
  `<div class="product-photo-full flex w-full items-center justify-center overflow-hidden rounded-2xl bg-surface-2 text-faint">
    ${dataImage(src)
    ? `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}">`
    : icon('image', 'size-8')}
  </div>`
);
