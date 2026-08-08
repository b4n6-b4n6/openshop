import {
  emptyState,
  productCard,
} from '../../shared/pages/components.js';
import { appFrame, document } from '../../shared/pages/layout.js';

const productsPage = ({ allProducts }) => document({
  title: 'Products',
  body: appFrame({
    title: 'Products',
    back: '/browser/',
    content: allProducts.length
      ? `<div class="flex flex-col gap-2.5 px-5 py-5">
        ${allProducts.map((product) => productCard({
    product,
    actionHref: `/browser/products/${product.id}`,
    actionLabel: 'Purchase',
  })).join('')}
      </div>`
      : emptyState({
        emptyIcon: 'boxes',
        title: 'No products',
        description: 'This shop has not listed any products yet.',
      }),
  }),
});

export default productsPage;
