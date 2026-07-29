import head from './head.js';
import bufferToDataURI from '../../utils/bufferToDataURI.js';

const viewShopPage = ({
  address,
  name,
  description,
  profile_photo,
  banner_photo,
}) => `<!doctype html>
<html>
<head>
  ${head()}

  <style>
    button {
      font-size: 150%;
    }

    [src='/self-test'] {
      width: 1em;
      height: 1em;
      border: 1px solid black;
    }

    [src='/sync-status'] {
      width: 6em;
      height: 1em;
      border: 1px solid black;
    }

    input[type='file'] {
      display: none;
    }

    input[name='address'] {
      width: 40em;
      text-align: center;
      font-family: monospace;
      font-size: 1em;
    }

    img {
      border: 1px dotted black;
    }
    
    .enlarged {
      transform: scale(1200%);
    }
  </style>
</head>
<body>
  <iframe
    src="/self-test">
  </iframe>

  <br>

  <iframe
    src="/sync-status">
  </iframe>

  <br>

  <input name='address' type='text' readonly value='${address}'/>
  <br>

  <button class='qr-button'>▣</button>
  <br>
  <script>
    document
      .querySelector('.qr-button')
      .addEventListener('click', (event) => {
        event.target.classList.toggle('enlarged')
      })
  </script>

  <img alt='profile photo' src="${profile_photo && bufferToDataURI('unknown', profile_photo)}">
  <br>

  <img alt='banner photo' src="${banner_photo && bufferToDataURI('unknown', banner_photo)}">
  <br>

  <input type='text' readonly placeholder='Shop name' value='${name}'>
  <br>

  <textarea readonly placeholder='Shop description'>${description}</textarea>

  <form action='/shop/settings'><button>EDIT SHOP NAME</button></form>
  <form action='/shop/settings'><button>EDIT SHOP DESCRIPTION</button></form>

  <script>
    implementImageUpload = (selectorQuery) => {
      const form = document.querySelector(selectorQuery)
      const fileInput = form.querySelector('input[type=file]')
      const changeButton = form.querySelector('button')

      fileInput.addEventListener('change', (event) => {
        const files = event.target.files

        if (files.length) {
          changeButton.disabled = true
          form.submit()
        }
      })
      changeButton.addEventListener('click', (event) => {
        fileInput.click()
      })
    };
  </script>

  <form action='/shop/settings/profile-photo' method='POST' enctype='multipart/form-data'>
    <button type='button'>CHANGE PROFILE PHOTO</button>

    <input name='photo' type='file' />
  </form>
  <script>
    implementImageUpload('[action="/shop/settings/profile-photo"]')
  </script>

  <form action='/shop/settings/banner-photo' method='POST' enctype='multipart/form-data'>
    <button type='button'>CHANGE BANNER PHOTO</button>

    <input name='photo' type='file' />
  </form>
  <script>
    implementImageUpload('[action="/shop/settings/banner-photo"]')
  </script>

  <form action='/products'><button>VIEW MY PRODUCTS</button></form>
  <form action='/chats'><button>VIEW MY CHATS</button></form>
  <form action='/orders'><button>VIEW MY ORDERS</button></form>

  <hr>

  <form action='/'><button>CLOSE SHOP</button></form>
</body>
</html>`;

export default viewShopPage;
