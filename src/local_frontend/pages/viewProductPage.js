import { CURRENCIES, IMG_SRC_PLACEHOLDER } from '../../const.js';
import bufferToDataURI from '../../utils/bufferToDataURI.js';
import head from './head.js';
import indicators from './indicators.js';

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
  ${indicators()}

  <form action='/shop/products/${id}' method='POST' enctype='multipart/form-data'>
    <input
      type='text'
      name='name'
      placeholder='Product name'
      value='${name}'
    >
    <br>

    <textarea
      name='description'
      placeholder='Product description'
    >${description}</textarea>
    <br>

    <img
      class='change-product-photo-preview'
      alt='product photo'
      src="${photo ? bufferToDataURI('unknown', photo) : IMG_SRC_PLACEHOLDER}"
    >
    <br>

    <button
      class='change-product-photo-button'
      type='button'
    >CHANGE PRODUCT PHOTO</button>
    <input
      class='change-product-photo-file-input'
      name='photo'
      type='file'
    >
    <br>

    <script>
      (() => {
        const previewImg = document.querySelector('.change-product-photo-preview')
        const fileInput = document.querySelector('.change-product-photo-file-input')
        const changeButton = document.querySelector('.change-product-photo-button')

        fileInput.addEventListener('change', (event) => {
          const files = event.target.files

          if (files.length) {
            const file = files[0]
            const reader = new FileReader()

            reader.addEventListener("load", () => {
              previewImg.src = reader.result
            })

            if (file) {
              reader.readAsDataURL(file)
            }
          }
        })
        changeButton.addEventListener('click', (event) => {
          fileInput.click()
        })
      })()
    </script>

    <select name='currency'>
      <option value="">CURRENCY</option>

  ${CURRENCIES.map((aCurrency) => (
    `<option
      value=${aCurrency}
      ${aCurrency === currency ? 'selected' : ''}
    >${aCurrency.toUpperCase()}</option>`
  )).join('\n')}
    </select><br>

    <input
      type='number'
      name='price'
      placeholder='Price'
      step='0.01'
      min='0'
      value='${price}'
    ><br>

    <input
      type='number'
      name='available_quantity'
      placeholder='Available quantity'
      min='0'
      value='${available_quantity}'
    ><br>

    <button type='submit'>UPDATE</button>
  </form>
  <script>
    document
      .querySelector('form button[type="submit"]')
      .addEventListener('click', (event) => {
        event.target.disabled = true
        document.querySelector('[method="POST"]').submit()
      })
  </script>
  <hr>

  <form action='/shop/products'><button>BACK</button></form>
</body>
</html>`;

export default viewProductPage;
