import {
  emptyState,
  formatFiat,
  thumb,
  truncateMiddle,
} from './components.js';
import {
  appFrame,
  document,
  icon,
} from './layout.js';
import { escapeAttribute, escapeHtml } from '../utils/html.js';
import formatUserId from '../../utils/formatUserId.js';
import formatDate from '../../utils/formatDate.js';

const formatTime = (value) => new Intl.DateTimeFormat('en', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}).format(new Date(value));

const formatUserIdOrShopAddress = (v) => (
  v.endsWith('.onion')
    ? truncateMiddle(v)
    : formatUserId(v)
);

const eventKey = ({ id, ext_message_type, ext_message_occured_at }) => (
  ext_message_type === 'CONVO'
    ? `message:${id}`
    : `${ext_message_type}:${id}:${new Date(ext_message_occured_at).getTime()}`
);

const receipt = ({ payload, owner }) => {
  if (payload.read_at) {
    return `<span title="Read" aria-label="Read">${icon('checkCheck', 'size-3.5')}</span>`;
  }
  if (owner && payload.received_at) {
    return `<span title="Received" aria-label="Received">${icon('check', 'size-3.5')}</span>`;
  }
  return '';
};

const messageBubble = ({
  event,
  me,
  owner,
  imageBase,
}) => {
  const payload = event.ext_message_payload;
  const own = payload.sender === me;
  const imageHref = `${imageBase}/${encodeURIComponent(event.id)}`;
  const imageSource = escapeAttribute(`${imageHref}?inline=1`);
  const time = `<span title="${escapeAttribute(new Date(payload.created_at))}">${escapeHtml(formatTime(payload.created_at))}</span>`;

  if (payload.image_content_exists) {
    const image = own
      ? `<button type="button" data-chat-image class="chat-image-loaded" aria-label="Open image viewer">
          <img data-chat-image-content src="${imageSource}" alt="Image attachment">
        </button>`
      : `<button type="button" data-chat-image-load class="chat-image-placeholder" aria-label="Download and display image">
          ${payload.image_blur_preview
    ? `<img src="${escapeAttribute(payload.image_blur_preview)}" alt="" aria-hidden="true">`
    : `<span class="text-faint">${icon('image', 'size-8')}</span>`}
          <span class="chat-image-download">${icon('download', 'size-5')}</span>
        </button>
        <button type="button" data-chat-image class="chat-image-loaded" aria-label="Open image viewer" hidden>
          <img data-chat-image-content data-src="${imageSource}" alt="Image attachment">
        </button>`;

    return `<div data-event-key="${escapeAttribute(eventKey(event))}" class="flex ${own ? 'justify-end' : 'justify-start'}">
      <div class="chat-image-message">
        ${image}
        <span class="chat-image-meta" title="${escapeAttribute(new Date(payload.created_at))}">
          ${time}
          ${own ? receipt({ payload, owner }) : ''}
        </span>
      </div>
    </div>`;
  }

  return `<div data-event-key="${escapeAttribute(eventKey(event))}" class="flex ${own ? 'justify-end' : 'justify-start'}">
    <div class="max-w-[82%] rounded-2xl px-3 py-2 ${own ? 'bg-accent text-on-accent' : 'border border-border bg-surface text-text'}">
      <p class="whitespace-pre-wrap break-words text-[14px]">${escapeHtml(payload.text_content)}</p>
      <span class="mt-1 flex items-center justify-end gap-1 text-[10px] ${own ? 'text-on-accent/70' : 'text-faint'}">
        ${time}
        ${own ? receipt({ payload, owner }) : ''}
      </span>
    </div>
  </div>`;
};

const ORDER_EVENTS = {
  NEW_ORDER_CREATED: {
    label: 'New order',
    classes: 'border-accent/30 bg-accent-soft text-accent',
  },
  ORDER_DEPOSIT_DETECTED: {
    label: 'Incoming transaction detected',
    classes: 'border-warning/30 bg-warning/15 text-warning',
  },
  ORDER_DEPOSIT_CONFIRMED: {
    label: 'Incoming transaction confirmed',
    classes: 'border-success/30 bg-success/15 text-success',
  },
};

const orderEventBubble = ({ event, orderBase }) => {
  const payload = event.ext_message_payload;
  const state = ORDER_EVENTS[event.ext_message_type] ?? {
    label: 'Order update',
    classes: 'border-border bg-surface-2 text-muted',
  };

  return `<div data-event-key="${escapeAttribute(eventKey(event))}" class="flex justify-start">
    <div class="max-w-[82%] rounded-2xl border p-3 ${state.classes}">
      <p class="mb-2 text-[11px] font-semibold uppercase tracking-wide">${escapeHtml(state.label)}</p>
      <div class="flex items-center gap-2 text-text">
        ${thumb(payload.product_photo, 40)}
        <div class="min-w-0 flex-1">
          <p class="truncate text-[14px] font-semibold">${escapeHtml(payload.product_name)}</p>
          <p class="text-[12px] text-muted">${Number(payload.purchase_quantity)} × ${escapeHtml(formatFiat(payload.purchase_price, payload.purchase_currency))}</p>
        </div>
      </div>
      <div class="mt-2 flex items-end justify-between gap-3">
        <span title="${escapeAttribute(event.ext_message_occured_at)}" class="py-1 text-[11px] text-faint">${escapeHtml(formatTime(event.ext_message_occured_at))}</span>
        <a href="${escapeAttribute(`${orderBase}/${encodeURIComponent(event.id)}`)}" target="_top" class="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-text">View</a>
      </div>
    </div>
  </div>`;
};

export const chatsPage = ({
  status = '', chats, version, refresh,
}) => document({
  title: 'Chats',
  scripts: ['sound.js'],
  body: appFrame({
    title: 'Chats',
    titleIcon: icon('message', 'size-4'),
    back: '/shop',
    status,
    animate: false,
    content: `<div data-chat-list data-version="${escapeAttribute(version)}">
      ${chats.length
    ? `<div class="flex flex-col gap-2.5 px-5 py-5">${chats.map((chat) => (
      `<a href="/shop/convos/${encodeURIComponent(chat.id)}" class="block text-left active:scale-[0.99]">
        <article class="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted">${icon('message', 'size-5')}</div>
          <div class="min-w-0 flex-1">
            <p class="truncate font-mono text-[13px] text-text">${escapeHtml(formatUserIdOrShopAddress(chat.id))}</p>
            <p title="${escapeAttribute(chat.last_message_at)}" class="text-[12px] text-faint">${escapeHtml(formatDate(chat.last_message_at))}</p>
          </div>
          <span data-unread-dot data-chat-id="${escapeAttribute(chat.id)}" class="${chat.unread ? 'block' : 'hidden'} size-2.5 shrink-0 rounded-full bg-accent" aria-label="Unread messages"></span>
          <span class="text-faint">${icon('chevronRight', 'size-4')}</span>
        </article>
      </a>`
    )).join('')}</div>`
    : emptyState({
      emptyIcon: 'message',
      title: 'No chats yet',
      description: 'Conversations with customers appear here.',
    })}
    </div>`,
  }),
  refresh,
});

export const chatPage = ({
  title,
  back,
  action,
  thread,
  owner = false,
  error = '',
  status = '',
}) => document({
  title,
  scripts: ['sound.js', 'chat.js'],
  body: `<form method="post" action="${escapeAttribute(action)}" enctype="multipart/form-data" class="contents" data-chat-form>
    ${appFrame({
    title: formatUserIdOrShopAddress(title),
    titleIcon: icon('message', 'size-4'),
    back,
    status,
    animate: false,
    content: `${error ? `<div role="alert" class="mx-4 mt-4 rounded-xl border border-danger/35 bg-danger/10 p-3 text-[13px] text-danger">${escapeHtml(error)}</div>` : ''}
      <iframe data-chat-frame title="Messages" src="${escapeAttribute(thread)}" class="chat-frame h-full w-full border-0 bg-base"></iframe>`,
    bottom: `<div data-chat-error role="alert" class="mb-2 hidden rounded-xl border border-danger/35 bg-danger/10 px-3 py-2 text-[12px] text-danger"></div>
      <div data-chat-attachment class="mb-2 hidden items-center gap-2 rounded-xl border border-border bg-surface-2 p-2">
        <img data-chat-attachment-preview alt="" class="size-10 shrink-0 rounded-lg object-cover">
        <span data-chat-attachment-name class="min-w-0 flex-1 truncate text-[12px] text-muted"></span>
        <button type="button" data-chat-attachment-remove class="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface" aria-label="Remove image attachment">×</button>
      </div>
      <div class="flex items-center gap-2">
        <input name="text" maxlength="5000" placeholder="Text message" class="h-11 min-w-0 flex-1 rounded-xl border border-border bg-surface-2 px-4 text-[15px] text-text placeholder:text-faint outline-none focus:border-accent focus:ring-2 focus:ring-accent/30">
        <label class="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-muted hover:bg-surface-2" aria-label="Attach image">
          ${icon('image', 'size-5')}
          <input data-chat-file type="file" name="image" accept="image/png,image/jpeg,image/webp,image/gif" class="hidden">
        </label>
        <button data-chat-send type="submit" class="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent hover:bg-accent-hover disabled:opacity-50" aria-label="Send message">${icon('send', 'size-5')}</button>
      </div>`,
  })}
  </form>`,
});

export const chatThreadPage = ({
  allExtMessages,
  me,
  chatId,
  imageBase,
  orderBase,
  version,
  refresh,
  owner = false,
}) => {
  const lastIncoming = allExtMessages.filter((event) => (
    event.ext_message_type === 'CONVO'
      && event.ext_message_payload.sender !== me
  )).at(-1)?.id ?? '';

  return document({
    title: 'Messages',
    scripts: ['messages.js'],
    body: `<div class="thread-body flex gap-2.5 px-4 py-5" data-chat="${escapeAttribute(chatId)}" data-version="${escapeAttribute(version)}" data-last-incoming="${escapeAttribute(lastIncoming)}">
      ${allExtMessages.length
    ? allExtMessages.toReversed().map((event) => (
      event.ext_message_type === 'CONVO'
        ? messageBubble({
          event, me, owner, imageBase,
        })
        : orderEventBubble({ event, orderBase })
    )).join('')
    : '<p data-thread-empty class="my-auto text-center text-[13px] text-faint">No messages yet. Say hello.</p>'}
    </div>`,
    refresh,
  });
};
