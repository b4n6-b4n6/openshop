import head from './head.js';

const myShopPage = ({ address }) => `<!doctype html>
<html>
<head>
  ${head()}

  <style>
    button {
      font-size: 250%;
    }
    
    [src="/self-test"] {
      width: 1em;
      height: 1em;
      border: 0;
    }
  </style>
</head>
<body>
  <pre>${address}</pre>

  <iframe
    src="/self-test">
  </iframe>

  <form action='/'>
    <button>CLOSE SHOP</button>
  </form>
</body>
</html>`;

export default myShopPage;
