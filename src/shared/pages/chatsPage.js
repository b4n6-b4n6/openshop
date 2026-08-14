import { emptyState } from './components.js';
import { appFrame, document, icon } from './layout.js';
import { escapeAttribute, escapeHtml } from '../utils/html.js';
import formatDate from '../../utils/formatDate.js';
import formatUserIdOrShopAddress from '../utils/formatUserIdOrShopAddress.js';

export const chatsPage = ({
  status = '',
}) => document({
  title: 'Chats',
  scripts: ['sound.js'],
  body: appFrame({
    title: 'Chats',
    titleIcon: icon('message', 'size-4'),
    back: '/shop',
    status,
    animate: false,
    content: (
      `<iframe
        title="Chats"
        src="/shop/convos/thread"
        class="live-frame h-full w-full border-0 bg-base"
      ></iframe>`
    ),
  }),
});

export const chatsThreadPage = ({
  chats, version, refresh,
}) => document({
  title: 'Chats',
  scripts: ['sound.js'],
  body: (
    `<div class='live-body' data-chat-list data-version="${escapeAttribute(version)}">
      ${(chats.length
      ? (
        `<div class="flex flex-col gap-2.5 px-5 py-5">${(
          chats.map((chat) => (
            `<a
              href="/shop/convos/${encodeURIComponent(chat.id)}"
              class="block text-left active:scale-[0.99]"
              target="_top"
            >
              <article class="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted"
                >${icon('message', 'size-5')}</div>
                <div class="min-w-0 flex-1">
                  <p
                    class="truncate font-mono text-[13px] text-text"
                  >${escapeHtml(formatUserIdOrShopAddress(chat.id))}</p>
                  <p
                    title="${escapeAttribute(chat.last_message_at)}"
                    class="text-[12px] text-faint"
                  >${escapeHtml(formatDate(chat.last_message_at))}</p>
                </div>
                <span
                  data-unread-dot
                  data-chat-id="${escapeAttribute(chat.id)}"
                  class="${chat.unread ? 'block' : 'hidden'}
                  size-2.5 shrink-0 rounded-full bg-accent" aria-label="Unread messages"
                ></span>
                <span
                  class="text-faint"
                >${icon('chevronRight', 'size-4')}</span>
              </article>
            </a>`
          )).join('')
        )}</div>`
      )
      : emptyState({
        emptyIcon: 'message',
        title: 'No chats yet',
        description: 'Conversations with customers appear here.',
      }))}
    </div>`
  ),
  refresh,
});
