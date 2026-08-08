import { escapeAttribute } from '../../shared/utils/html.js';

export default async (ctx) => {
  const { backend, onionSpinner } = ctx;
  const state = await backend.messages.getNotificationState(onionSpinner.onion);

  ctx.set('Cache-Control', 'no-store');
  ctx.type = 'text/html; charset=utf-8';
  ctx.body = `<div data-chat-status data-latest-incoming="${escapeAttribute(state.latestIncomingId ?? '')}">
    ${state.unreadChatIds.map(
    (id) => `<span data-unread-chat="${escapeAttribute(id)}"></span>`,
  ).join('')}
  </div>`;
};
