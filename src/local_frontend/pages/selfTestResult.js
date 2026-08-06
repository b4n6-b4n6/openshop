const selfTestResultPage = ({ result } = {}) => {
  let label = 'Checking…';
  let color = '#f6b23c';
  let bg = 'rgb(246 178 60 / 15%)';
  let border = 'rgb(246 178 60 / 30%)';
  let title = 'Checking shop connectivity';

  if (result === true) {
    label = 'Online';
    color = '#34d39a';
    bg = 'rgb(52 211 154 / 15%)';
    border = 'rgb(52 211 154 / 30%)';
    title = 'Shop onion service is online';
  } else if (result === false) {
    label = 'Offline';
    color = '#f25c54';
    bg = 'rgb(242 92 84 / 15%)';
    border = 'rgb(242 92 84 / 30%)';
    title = 'Shop onion service is offline';
  }

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="15">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Shop status</title>
  <style>
    * { box-sizing: border-box; }
    html, body { background: transparent !important; height: 100%; margin: 0; }
    body {
      align-items: center;
      background: transparent;
      display: flex;
      font-family: ui-sans-serif, system-ui, sans-serif;
      justify-content: flex-end;
      overflow: hidden;
    }
    .pill {
      align-items: center;
      background: ${bg};
      border: 1px solid ${border};
      border-radius: 999px;
      color: ${color};
      display: inline-flex;
      font-size: 11px;
      font-weight: 700;
      gap: 6px;
      height: 26px;
      padding: 0 9px;
      white-space: nowrap;
    }
    .dot {
      background: currentColor;
      border-radius: 999px;
      height: 7px;
      width: 7px;
    }
  </style>
</head>
<body>
  <span class="pill" title="${title}"><span class="dot"></span>${label}</span>
</body>
</html>`;
};

export default selfTestResultPage;
