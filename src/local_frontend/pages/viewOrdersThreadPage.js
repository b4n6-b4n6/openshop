import { ORDERS_PAGE_REFRESH } from '../../const.js';
import { ordersThreadPage } from '../../shared/pages/orderPages.js';

export default ({ allOrders }) => ordersThreadPage({
  allOrders,
  owner: true,
  refresh: ORDERS_PAGE_REFRESH,
});
