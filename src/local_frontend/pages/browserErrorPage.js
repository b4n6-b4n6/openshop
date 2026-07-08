import head from './head.js';

const browserErrorPage = () => `<!doctype html>
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
  <pre>ERROR</pre>

  <form action='/browser-input'>
    <button>BACK</button>
  </form>
}
</body>
</html>`;

export default browserErrorPage;
