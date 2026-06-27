import head from './head.js';

const root = () => `<!doctype html>
<html>
<head>
  ${head()}
</head>
<body>
  <button>OPEN NEW SHOP</button> <br>
  <button>BROWSE SHOP</button>
</body>
</html>`;

export default root;
