import { orderPage } from '../../shared/pages/orderPage.js';

export default ({ id, qr, qrCaption }) => (
  orderPage({
    thread: `/browser/orders/${id}/thread`,
    owner: false,
    back: '/browser/orders',
    qr,
    qrCaption,
    qrFileName: `openshop-order-${id}.png`,
  })
);
