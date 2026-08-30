import { escapeAttribute, escapeHtml } from '../utils/html.js';
import { icon } from './layout.js';

export default ({
  href,
  label,
  linkIcon,
  unread,
  chatId,
}) => (
  `<a
    href="${escapeAttribute(href)}"
    class="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 text-left transition-colors hover:border-border-strong active:scale-[0.99]"
  >
    <span class="text-accent">${icon(linkIcon, 'size-5')}</span>
    <span class="flex-1 text-[15px] font-medium text-text">${escapeHtml(label)}</span>
    ${
      unread === undefined && !chatId
        ? ''
        : (
          `<span data-unread-dot${chatId ? ` data-chat-id="${escapeAttribute(chatId)}"` : ''} class="${unread ? 'block' : 'hidden'} size-2.5 shrink-0 rounded-full bg-accent" aria-label="Unread messages"></span>`
        )}
    <span class="text-faint">${icon('chevronRight', 'size-4')}</span>
  </a>`
);
