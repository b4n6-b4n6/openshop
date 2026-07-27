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
      border: 1px solid black;
    }

    [src="/sync-status"] {
      width: 6em;
      height: 1em;
      border: 1px solid black;
    }
  </style>
</head>
<body>
  <pre>${address}</pre>

  <iframe
    src="/self-test">
  </iframe>

  <br>

  <iframe
    src="/sync-status">
  </iframe>

  <br>

  <form action='/'>
    <button>CLOSE SHOP</button>
  </form>
</body>
</html>`;

export default myShopPage;
