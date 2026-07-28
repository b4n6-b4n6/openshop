import head from './head.js';

const rootPage = () => `<!doctype html>
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
  <form action='/wallet-setup'>
    <button>OPEN NEW SHOP</button>
  </form>
  <form action='/browser-input'>
    <button>BROWSE SHOP</button>
  </form>
</body>
</html>`;

export default rootPage;
