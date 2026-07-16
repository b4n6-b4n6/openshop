/* eslint-disable import/no-unresolved */
import http from 'node:http';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { BROWSED_ONION_COOKIE_NAME, BROWSER_TIMEOUT } from '../../const.js';
import { errorBody, PublicError } from '../../utils/publicError.js';

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

const socksAgent = new SocksProxyAgent('socks5h://127.0.0.1:39050');
export default (ctx) => new Promise((resolve) => {
  const browsedOnion = ctx.cookies.get(BROWSED_ONION_COOKIE_NAME);

  if (!browsedOnion) {
    ctx.redirect('/browse');
    resolve();
    return;
  }

  const browsePath = ctx.params.browsePath || '';
  const targetPath = browsePath.startsWith('/') ? browsePath : `/${browsePath}`;
  const targetUrl = new URL(
    targetPath + (ctx.querystring ? `?${ctx.querystring}` : ''),
    `http://${browsedOnion}`,
  );

  const headers = { ...ctx.headers };
  delete headers['proxy-authenticate'];
  delete headers['proxy-authorization'];
  delete headers['transfer-encoding'];
  delete headers['keep-alive'];
  delete headers.host;
  delete headers.connection;
  delete headers.te;
  delete headers.trailer;
  delete headers.upgrade;

  if (headers.cookie) {
    headers.cookie = sanitiseCookie(headers.cookie, browsedOnion);
  }

  headers['user-agent'] = 'OpenShop/0.0.0';

  headers.host = targetUrl.host;

  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port || 80,
    path: targetUrl.pathname + targetUrl.search,
    method: ctx.method,
    agent: socksAgent,
    timeout: BROWSER_TIMEOUT,
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

    const publicError = new PublicError(
      err.message === 'Upstream timeout'
        ? 'The onion shop did not respond within 30 seconds.'
        : 'The onion shop could not be reached. It may be offline.',
      { status: 502, code: err.message === 'Upstream timeout' ? 'timeout' : 'unreachable' },
    );

    if (targetPath.startsWith('/api/')) {
      ctx.status = publicError.status;
      ctx.type = 'application/json';
      ctx.body = errorBody(publicError);
    } else {
      ctx.redirect(`/browse/error?message=${encodeURIComponent(publicError.message)}`);
    }

    resolve();
  });

  if (['POST', 'PUT', 'PATCH'].includes(ctx.method) && ctx.req.readable) {
    ctx.req.pipe(proxyReq);
  } else {
    proxyReq.end();
  }
});
