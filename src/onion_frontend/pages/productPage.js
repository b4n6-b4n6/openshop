import { CURRENCIES, IMG_SRC_PLACEHOLDER } from '../../const.js';
import bufferToDataURI from '../../utils/bufferToDataURI.js';
import head from './head.js';

const viewProductPage = ({
  id,
  name,
  photo,
  description,
  price,
  currency,
  available_quantity,
}) => `<!doctype html>
<html>
<head>
  ${head()}

  <style>
    input[type='file'] {
      display: none
    }
  </style>
</head>
<body>
  <form action='/shop/products/${id}' method='POST'>
    <input
      type='text'
      readOnly
      value='${name}'
    >
    <br>

    <textarea
      readOnly
    >${description}</textarea>
    <br>

    <img
      class='change-product-photo-preview'
      alt='product photo'
      src="${photo ? bufferToDataURI('unknown', photo) : IMG_SRC_PLACEHOLDER}"
    >
    <br>

    <label>
      PRICE: 
      <input
        type='number'
        readonly
        value='${price}'
      >
      <input
        type='text'
        readonly
        value='${currency}'
      >
    </label><br>

    <label>
      AVAILABLE QUANTITY: 
      <input
        type='number'
        readonly
        value='${available_quantity}'
      >
    </label><br>

    <label>
      PURCHASE QUANTITY: 
      <input
        type='number'
        min='1'
        max='${available_quantity}'
        required
      >
    </label><br>

    <button>PURCHASE</button>
  </form>
  <hr>

  <form action='/browser/products'><button>BACK</button></form>
</body>
</html>`;

export default viewProductPage;
