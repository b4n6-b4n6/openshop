const syncStatusResult = ({ height, percent } = {}) => {
  const hasProgress = Number.isFinite(height) && Number.isFinite(percent);
  const synchronized = hasProgress && percent >= 100;
  const progress = hasProgress ? Math.max(0, Math.min(100, Math.round(percent))) : null;
  let label = 'Wallet';
  if (synchronized) label = 'Synced';
  else if (progress !== null) label = `${progress}%`;
  const title = hasProgress
    ? `Wallet block ${height} · ${progress}% synchronized`
    : 'Waiting for wallet sync status';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="4">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Wallet sync status</title>
  <style>
    :root { color-scheme: dark; }
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
      background: ${synchronized ? 'rgb(52 211 154 / 15%)' : 'rgb(246 178 60 / 15%)'};
      border: 1px solid ${synchronized ? 'rgb(52 211 154 / 30%)' : 'rgb(246 178 60 / 30%)'};
      border-radius: 999px;
      color: ${synchronized ? '#34d39a' : '#f6b23c'};
      display: inline-flex;
      font-size: 11px;
      font-weight: 700;
      gap: 6px;
      height: 26px;
      padding: 0 9px;
      white-space: nowrap;
    }
    .dot {
      animation: ${synchronized ? 'none' : 'pulse 1.5s ease-in-out infinite'};
      background: currentColor;
      border-radius: 999px;
      height: 7px;
      width: 7px;
    }
    @keyframes pulse { 50% { opacity: 0.35; } }
    @media (prefers-reduced-motion: reduce) { .dot { animation: none; } }
  </style>
</head>
<body>
  <span class="pill" title="${title}"><span class="dot"></span>${label}</span>
</body>
</html>`;
};

export default syncStatusResult;
