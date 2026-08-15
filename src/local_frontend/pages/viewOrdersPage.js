import { ordersPage } from '../../shared/pages/ordersPage.js';
import indicators from './indicators.js';

export default () => ordersPage({
  status: indicators(),
  owner: true,
});
