import { IMG_SRC_PLACEHOLDER } from '../../const.js';
import bufferToDataURI from '../../utils/bufferToDataURI.js';
import formatDate from '../../utils/formatDate.js';
import head from './head.js';

const viewOrdersPage = ({
  allOrders,
}) => `<!doctype html>
<html>
<head>
  ${head()}

</head>
<body>
  ${allOrders.map(({
    id,
    product_name, product_photo,
    purchase_price, purchase_currency, purchase_quantity,
    deposit_txid,
    created_at,
  }) => (
    `<form action='/shop/orders/${id}' method='GET'>
      <input type='text' readOnly value='${product_name}'>
      <br>

      <img
        class='change-product-photo-preview'
        alt='product photo'
        src="${product_photo ? bufferToDataURI('unknown', product_photo) : IMG_SRC_PLACEHOLDER}"
      >
      <br>

      Purchase price ${purchase_price} ${purchase_currency}
      <br>

      Purchase quantity ${purchase_quantity}
      <br>

      ${(
      deposit_txid
        ? `<h3><pre>DEPOSIT TXID${deposit_txid}</pre></h3>`
        : ''
    )}

      Created <small title='${created_at}'>${formatDate(created_at)}</small>
      <br>

      <button>VIEW</button>
    </form>`
  )).join('<hr>')}

  <hr>

  <form action='/shop/'><button>BACK</button></form>
</body>
</html>`;

export default viewOrdersPage;
