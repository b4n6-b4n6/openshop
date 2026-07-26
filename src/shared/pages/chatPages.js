import {
  appFrame,
  document,
  icon,
  pathFor,
} from './layout.js';
import {
  emptyState,
  hubLink,
  messageBubble,
  truncateMiddle,
} from './components.js';
import { escapeAttribute, escapeHtml } from '../utils/html.js';

export const chatsPage = ({
  chats,
  basePath = '',
  owner = false,
}) => {
  const root = owner ? '/shop/chats' : '/chats';
  return document({
    title: 'Chats',
    basePath,
    scripts: owner ? ['sound.js', 'owner-notifications.js'] : [],
    body: appFrame({
      title: 'Chats',
      back: owner ? '/shop' : '/',
      basePath,
      content: chats.length
        ? `<div class="flex flex-col gap-2.5 px-5 py-5">${chats.map((chat) => hubLink({
          href: pathFor(basePath, `${root}/${encodeURIComponent(chat.id)}`),
          label: truncateMiddle(chat.id, 10, 6),
          linkIcon: 'message',
          unread: Boolean(chat.unread),
          chatId: chat.id,
        })).join('')}</div>`
        : emptyState({
          emptyIcon: 'message',
          title: 'No chats yet',
          description: owner
            ? 'Conversations with customers appear here.'
            : 'Send the shop a message to start.',
        }),
    }),
  });
};

export const chatPage = ({
  chatId,
  basePath = '',
  owner = false,
  error = '',
}) => {
  const root = owner ? '/shop/chats' : '/chats';
  const action = pathFor(basePath, `${root}/${encodeURIComponent(chatId)}/messages`);
  return document({
    title: chatId,
    basePath,
    scripts: ['sound.js', 'chat.js', ...(owner ? ['owner-notifications.js'] : [])],
    body: `<form method="post" action="${escapeAttribute(action)}" enctype="multipart/form-data" class="contents" data-chat-form>
      ${appFrame({
    title: truncateMiddle(chatId, 10, 6),
    back: root,
    basePath,
    content: `${error ? `<div role="alert" class="mx-4 mt-4 rounded-xl border border-danger/35 bg-danger/10 p-3 text-[13px] text-danger">${escapeHtml(error)}</div>` : ''}
          <iframe title="Messages" src="${escapeAttribute(pathFor(basePath, `${root}/${encodeURIComponent(chatId)}/thread`))}" class="h-full w-full border-0 bg-base"></iframe>`,
    bottom: `<div data-chat-error role="alert" class="mb-2 hidden rounded-xl border border-danger/35 bg-danger/10 px-3 py-2 text-[12px] text-danger"></div>
        <div data-chat-attachment class="mb-2 hidden items-center gap-2 rounded-xl border border-border bg-surface-2 p-2">
          <img data-chat-attachment-preview alt="" class="size-10 shrink-0 rounded-lg object-cover">
          <span data-chat-attachment-name class="min-w-0 flex-1 truncate text-[12px] text-muted"></span>
          <button type="button" data-chat-attachment-remove class="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface" aria-label="Remove image attachment">×</button>
        </div>
        <div class="flex items-center gap-2">
          <input name="text" maxlength="5000" placeholder="Text message" class="h-11 min-w-0 flex-1 rounded-xl border border-border bg-surface-2 px-4 text-[15px] text-text placeholder:text-faint outline-none focus:border-accent focus:ring-2 focus:ring-accent/30">
          <label class="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-muted hover:bg-surface-2" aria-label="Send image">
            ${icon('image', 'size-5')}
            <input data-chat-file type="file" name="media" accept="image/png,image/jpeg,image/webp,image/gif" class="hidden">
          </label>
          <button data-chat-send type="submit" class="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent hover:bg-accent-hover disabled:opacity-50" aria-label="Send">➤</button>
        </div>`,
  })}
    </form>`,
  });
};

export const chatThreadPage = ({
  messages,
  me,
  chatId,
  basePath = '',
}) => {
  const lastIncoming = messages.filter((message) => message.sender !== me).at(-1)?.id ?? '';
  const version = messages.at(-1)?.id ?? 'empty';
  return document({
    title: 'Messages',
    basePath,
    scripts: ['messages.js'],
    body: `<div class="thread-body flex flex-col gap-2.5 px-4 py-5" data-chat="${escapeAttribute(chatId)}" data-version="${escapeAttribute(version)}" data-last-incoming="${escapeAttribute(lastIncoming)}">
      ${messages.length
    ? messages.map((message) => messageBubble({ message, me })).join('')
    : '<p data-thread-empty class="my-auto text-center text-[13px] text-faint">No messages yet. Say hello.</p>'}
    </div>`,
  });
};
