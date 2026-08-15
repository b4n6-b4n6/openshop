import { ORDERS_PAGE_REFRESH } from '../../const.js';
import { ordersThreadPage } from '../../shared/pages/ordersPage.js';

export default ({ allOrders }) => (
  ordersThreadPage({
    allOrders,
    refresh: ORDERS_PAGE_REFRESH,
  })
);
