import { productsPage } from '../../shared/pages/productsPage.js';

export default ({ allProducts }) => productsPage({
  allProducts,
  owner: false,
});
