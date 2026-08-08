import { orderPage } from '../../shared/pages/orderPages.js';
import indicators from './indicators.js';

export default (options) => orderPage({
  ...options,
  owner: true,
  status: indicators(),
});
