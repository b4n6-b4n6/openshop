import head from './head.js';
import refresher from './refresher.js';

const walletSetupProgressPage = () => `<!doctype html>
<html>
<head>
  ${head()}
  ${refresher()}

  <style>
    button {
      font-size: 250%;
    }
  </style>
</head>
<body>
  <pre><h1>CREATING WALLET...</h1></pre>
</body>
</html>`;

export default walletSetupProgressPage;
