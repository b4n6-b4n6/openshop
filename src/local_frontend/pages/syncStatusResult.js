import head from './head.js';
import refresher from './refresher.js';

const syncStatusResult = ({ height, percent } = {}) => `<!doctype html>
<html>
<head>
  ${head()}
  ${refresher({ interval: 4 })}

  <style>
    body {
      margin: 0;
      overflow: hidden;
      display: flex;
      height: 100vh;
      vertical-align: middle;
      font-family: monospace;
    }
    span {
      margin: auto;
    }
  </style>

</head>
<body>
  ${height
    ? `<span title='Current height is ${height}'>${percent === 100 ? 'Synchronized' : 'Synchronizing'}</span>`
    : ''
}
</body>
</html>`;

export default syncStatusResult;
