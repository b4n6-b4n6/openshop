/* eslint-disable no-constant-binary-expression */
import formatDate from '../../utils/formatDate.js';
import bufferToDataURI from '../../utils/bufferToDataURI.js';
import formatPiconero from '../../utils/formatPiconero.js';
import { IMG_SRC_PLACEHOLDER } from '../../const.js';
import head from './head.js';
import refresher from './refresher.js';

const orderPage = ({
  product_name,
  product_photo,
  product_description,
  purchase_currency,
  purchase_price,
  purchase_quantity,
  created_at,
  detected_deposit_at,
  confirmed_deposit_at,
  deposit_amount,
  deposit_address,
  deposit_txid,
}) => `<!doctype html>
<html>
<head>
  ${head()}
  ${!detected_deposit_at ? refresher({ interval: 30 }) : ''}

  <style>
    input[type='file'] {
      display: none
    }

    .enlarged {
      transform: scale(1200%);
    }
  </style>
</head>
<body>
  <input type='text' readOnly value='${product_name}'>
  <br>

  <textarea readOnly>${product_description}</textarea>
  <br>

  <img
    class='change-product-photo-preview'
    alt='product photo'
    src="${product_photo ? bufferToDataURI('unknown', product_photo) : IMG_SRC_PLACEHOLDER}"
  >
  <br>

  <h2>PAYMENT DETAILS</h2>
  <h3><pre>${deposit_address}</pre></h3>
  <br>
  <h3><pre>${formatPiconero(deposit_amount)} XMR</pre></h3>
  <br>

  <button class='qr-button'>▣</button>
  <script>
    document
      .querySelector('.qr-button')
      .addEventListener('click', (event) => {
        event.target.classList.toggle('enlarged')
      })
  </script>
  <br>

  Purchase price ${purchase_price} ${purchase_currency}
  <br>

  Purchase quantity ${purchase_quantity}
  <br>

  <h2>
  ${(
    false
    || (confirmed_deposit_at && 'INCOMING TRANSACTION CONFIRMED')
    || (detected_deposit_at && 'INCOMING TRANSACTION DETECTED')
    || 'WAITING FOR INCOMING TRANSACTION'
  )}
  </h2>
  ${(
    deposit_txid
      ? `<h3><pre>DEPOSIT TXID${deposit_txid}</pre></h3>`
      : ''
  )}

  Created <small title='${created_at}'>${formatDate(created_at)}</small>
  <br>

  <hr>

  <form action='/browser/orders'><button>BACK</button></form>
</body>
</html>`;

export default orderPage;
