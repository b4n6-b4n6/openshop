import { createHash } from 'node:crypto';

const hash = (value) => createHash('sha256')
  .update(JSON.stringify(value))
  .digest('base64url');

export const chatVersion = (events) => hash(events.map((event) => ({
  id: event.id,
  occuredAt: event.ext_message_occured_at,
  type: event.ext_message_type,
  receivedAt: event.ext_message_payload.received_at,
  readAt: event.ext_message_payload.read_at,
})));

export const chatListVersion = (chats) => hash(chats.map((chat) => ({
  id: chat.id,
  lastMessageAt: chat.last_message_at,
  lastMessageSender: chat.last_message_sender,
  unread: chat.unread,
})));

export const orderVersion = (order) => hash({
  depositDetectedAt: order.deposit_detected_at,
  depositConfirmedAt: order.deposit_confirmed_at,
  depositTxid: order.deposit_txid,
});
