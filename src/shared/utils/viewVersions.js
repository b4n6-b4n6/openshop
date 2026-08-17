import { createHash } from 'node:crypto';
import isOrderExpired from './isOrderExpired.js';

const hash = (value) => createHash('sha256')
  .update(JSON.stringify(value))
  .digest('base64url');

export const chatVersion = (events) => hash(events.map((event) => ({
  id: event.id,
  occuredAt: event.ext_message_occured_at,
})));

export const chatsVersion = (chats) => hash(chats.map((chat) => ({
  id: chat.id,
  lastMessageAt: chat.last_message_at,
  unread: chat.unread,
})));

export const orderVersion = (order) => hash({
  id: order.id,
  depositDetectedAt: order.deposit_detected_at,
  depositConfirmedAt: order.deposit_confirmed_at,
  expired: isOrderExpired(order),
});

export const ordersVersion = (orders) => hash(orders.map((order) => ({
  id: order.id,
  depositDetectedAt: order.deposit_detected_at,
  depositConfirmedAt: order.deposit_confirmed_at,
  expired: isOrderExpired(order),
})));
