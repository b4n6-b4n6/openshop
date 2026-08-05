import {
  emptyState,
  truncateMiddle,
} from '../../shared/pages/components.js';
import {
  appFrame,
  document,
  icon,
} from '../../shared/pages/layout.js';
import { escapeAttribute, escapeHtml } from '../../shared/utils/html.js';
import formatDate from '../../utils/formatDate.js';
import indicators from './indicators.js';

const viewConvosPage = ({ allConvos }) => document({
  title: 'Chats',
  refresh: 10,
  body: appFrame({
    title: 'Chats',
    back: '/shop',
    status: indicators(),
    animate: false,
    content: allConvos.length
      ? `<div class="flex flex-col gap-2.5 px-5 py-5">
        ${allConvos.map(({
    id,
    last_message_at,
    last_message_sender,
    unread,
  }) => {
    const isUnread = id === last_message_sender && unread;
    return `<a href="/shop/convos/${encodeURIComponent(id)}" class="block text-left active:scale-[0.99]">
      <article class="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
        <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted">${icon('message', 'size-5')}</div>
        <div class="min-w-0 flex-1">
          <p class="truncate font-mono text-[13px] text-text">${escapeHtml(truncateMiddle(id, 10, 6))}</p>
          <p title="${escapeAttribute(last_message_at)}" class="text-[12px] text-faint">${escapeHtml(formatDate(last_message_at))}</p>
        </div>
        ${isUnread
    ? '<span class="size-2.5 shrink-0 rounded-full bg-accent" aria-label="Unread messages"></span>'
    : ''}
        <span class="text-faint">${icon('chevronRight', 'size-4')}</span>
      </article>
    </a>`;
  }).join('')}
      </div>`
      : emptyState({
        emptyIcon: 'message',
        title: 'No chats yet',
        description: 'Conversations with customers appear here.',
      }),
  }),
});

export default viewConvosPage;
