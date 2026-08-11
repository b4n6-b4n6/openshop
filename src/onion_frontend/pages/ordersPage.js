import { ORDERS_PAGE_REFRESH } from '../../const.js';
import { ordersPage } from '../../shared/pages/orderPages.js';

export default ({ allOrders }) => ordersPage({
  allOrders,
  refresh: ORDERS_PAGE_REFRESH,
});
