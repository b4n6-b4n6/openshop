import { ordersPage } from '../../shared/pages/orderPages.js';
import indicators from './indicators.js';

export default ({ allOrders }) => ordersPage({
  allOrders,
  owner: true,
  status: indicators(),
});
