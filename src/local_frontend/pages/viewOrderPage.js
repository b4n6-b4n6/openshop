import { orderPage } from '../../shared/pages/orderPages.js';
import indicators from './indicators.js';

export default ({ id, customer }) => (
  orderPage({
    thread: `/shop/orders/${id}/thread`,
    owner: true,
    status: indicators(),
    back: '/shop/orders',
    chat: `/shop/convos/${customer}`,
  })
);
