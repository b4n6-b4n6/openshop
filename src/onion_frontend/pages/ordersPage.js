import { IMG_SRC_PLACEHOLDER } from '../../const.js';
import bufferToDataURI from '../../utils/bufferToDataURI.js';
import formatDate from '../../utils/formatDate.js';
import head from './head.js';
import refresher from './refresher.js';

const ordersPage = ({
  allOrders,
}) => `<!doctype html>
<html>
<head>
  ${head()}
  ${refresher({ interval: 10 })}

</head>
<body>
  ${allOrders.map(({
    id,
    product_name, product_photo,
    purchase_price, purchase_currency, purchase_quantity,
    created_at,
  }) => (
    `<form action='/browser/orders/${id}' method='GET'>
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

      Created <small title='${created_at}'>${formatDate(created_at)}</small>
      <br>

      <button>VIEW</button>
    </form>`
  )).join('<hr>')}

  <hr>

  <form action='/browser/'><button>BACK</button></form>
</body>
</html>`;

export default ordersPage;
