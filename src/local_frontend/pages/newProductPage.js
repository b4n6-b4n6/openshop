import { CURRENCIES, IMG_SRC_PLACEHOLDER } from '../../const.js';
import head from './head.js';
import indicators from './indicators.js';

const newProductPage = () => `<!doctype html>
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

  <form action='/shop/products/new' method='POST' enctype='multipart/form-data'>
    <input
      type='text'
      name='name'
      placeholder='Product name'
      value=''
    >
    <br>

    <textarea
      name='description'
      placeholder='Product description'
    ></textarea>
    <br>

    <img
      class='change-product-photo-preview'
      alt='product photo'
      src="${IMG_SRC_PLACEHOLDER}"
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
      <option>CURRENCY</option>

      ${(
    CURRENCIES.map((currency) => (
      `<option value=${currency}>${currency.toUpperCase()}</option>`
    )).join('\n')
  )}
    </select><br>

    <input
      type='number'
      name='price'
      placeholder='Price'
      step='0.01'
      min='0'
    ><br>

    <input
      type='number'
      name='available_quantity'
      placeholder='Available quantity'
      min='0'
    ><br>

    <button type='submit'>ADD</button>
  </form>
  <script>
    document
      .querySelector('form button[type="submit"]')
      .addEventListener('click', (event) => {
        event.target.disabled = true
        document.querySelector('[action="/shop/products/new"]').submit()
      })
  </script>
  <hr>

  <form action='/shop'><button>BACK</button></form>
</body>
</html>`;

export default newProductPage;
