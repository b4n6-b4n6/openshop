import { ORDERS_PAGE_REFRESH } from '../../const.js';
import { ordersPage } from '../../shared/pages/orderPages.js';
import indicators from './indicators.js';

export default ({ allOrders }) => ordersPage({
  allOrders,
  owner: true,
  status: indicators(),
  refresh: ORDERS_PAGE_REFRESH,
});
