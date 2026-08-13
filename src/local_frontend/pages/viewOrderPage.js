import { orderPage } from '../../shared/pages/orderPages.js';
import indicators from './indicators.js';

export default ({
  id, customer, qr, qrCaption,
}) => (
  orderPage({
    thread: `/shop/orders/${id}/thread`,
    owner: true,
    status: indicators(),
    back: '/shop/orders',
    chat: `/shop/convos/${customer}`,
    qr,
    qrCaption,
    qrFileName: `openshop-order-${id}.png`,
  })
);
