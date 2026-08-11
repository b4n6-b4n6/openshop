import { ordersPage } from '../../shared/pages/orderPages.js';
import indicators from './indicators.js';

export default () => ordersPage({
  status: indicators(),
  owner: true,
});
