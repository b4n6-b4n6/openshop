import { ORDER_EXPIRATION_TIME_MS } from '../../const.js';

const isOrderExpired = (order) => {
  if (!order) return false;
  if (order.deposit_confirmed_at || order.deposit_detected_at) return false;
  if (!order.created_at) return false;
  return Date.now() - new Date(order.created_at).getTime() > ORDER_EXPIRATION_TIME_MS;
};

export default isOrderExpired;
