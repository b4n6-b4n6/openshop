import head from './head.js';

const myShopPage = ({ address }) => `<!doctype html>
<html>
<head>
  ${head()}

  <style>
    button {
      font-size: 250%;
    }
  </style>
</head>
<body>
  <pre>${address}</pre>

  <form action='/'>
    <button>CLOSE SHOP</button>
  </form>
</body>
</html>`;

export default myShopPage;
