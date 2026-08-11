/* eslint-disable import/no-unresolved */
import http from 'node:http';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { BROWSED_ONION_COOKIE_NAME, BROWSER_TIMEOUT } from '../../const.js';
import browserErrorPage from '../pages/browserErrorPage.js';

const sanitiseCookie = (cookie, browsedOnion) => {
  const stripCookieRegExp = (
    new RegExp(`^${RegExp.escape(browsedOnion)}\\.`, '')
  );

  return (
    cookie
      .split('; ')
      .filter((line) => line.startsWith(browsedOnion))
      .map((line) => line.replace(stripCookieRegExp, ''))
      .join('; ')
  );
};

const sanitiseSetCookie = (setCookie, browsedOnion) => (
  `${browsedOnion}.${setCookie}`
);

const purgeHeaders = (oldHeaders) => {
  const headers = { ...oldHeaders };

  delete headers['proxy-authenticate'];
  delete headers['proxy-authorization'];
  delete headers['transfer-encoding'];
  delete headers['keep-alive'];
  delete headers.host;
  delete headers.connection;
  delete headers.te;
  delete headers.trailer;
  delete headers.upgrade;

  return headers;
};

const sanitiseHeaders = (headers, browsedOnion) => (
  headers.cookie
    ? { cookie: sanitiseCookie(headers.cookie, browsedOnion) }
    : {}
);

const socksAgent = new SocksProxyAgent( // this likely needs to rotate / TODO
  'socks5h://127.0.0.1:39050',
  { timeout: BROWSER_TIMEOUT },
);

export default (ctx) => new Promise((resolve) => {
  const browsedOnion = ctx.cookies.get(BROWSED_ONION_COOKIE_NAME);

  if (!browsedOnion) {
    ctx.redirect('/browser-input');
    resolve();
    return;
  }

  const browsePath = ctx.path || '';
  const targetPath = browsePath.startsWith('/') ? browsePath : `/${browsePath}`;
  const targetUrl = new URL(
    targetPath + (ctx.querystring ? `?${ctx.querystring}` : ''),
    `http://${browsedOnion}`,
  );

  const headers = {
    ...purgeHeaders(ctx.headers),
    ...sanitiseHeaders(ctx.headers, browsedOnion),
    'user-agent': 'OpenShop/0.0.0',
    host: targetUrl.host,
  };

  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port || 80,
    path: targetUrl.pathname + targetUrl.search,
    method: ctx.method,
    agent: socksAgent,
    headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    ctx.status = proxyRes.statusCode || 502;

    Object.entries(proxyRes.headers).forEach(([key, value]) => {
      if (!value) { return; }

      ctx.set(
        key,
        key === 'set-cookie'
          ? value.map((line) => sanitiseSetCookie(line, browsedOnion))
          : value,
      );
    });

    proxyRes.pipe(ctx.res);
    proxyRes.on('end', resolve);
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy(new Error('Upstream timeout'));
  });

  proxyReq.on('error', (err) => {
    console.error(err);

    ctx.status = 502;
    ctx.body = browserErrorPage({
      message: err.message,
      autoRetry: ctx.headers['sec-fetch-dest'] === 'iframe',
    });

    resolve();
  });

  if (['POST', 'PUT', 'PATCH'].includes(ctx.method) && ctx.req.readable) {
    ctx.req.pipe(proxyReq);
  } else {
    proxyReq.end();
  }
});
