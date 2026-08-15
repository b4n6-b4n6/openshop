import { productsPage } from '../../shared/pages/productsPage.js';
import indicators from './indicators.js';

export default ({ allProducts }) => productsPage({
  allProducts,
  owner: true,
  status: indicators(),
});
