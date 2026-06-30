/* eslint-disable import/no-unresolved */
import http from 'node:http';
import { SocksProxyAgent } from 'socks-proxy-agent';

const TIMEOUT = 30 * 1000;

const socksAgent = new SocksProxyAgent('socks5h://127.0.0.1:39050');
export default (ctx) => new Promise((resolve) => {
  const { onion } = ctx.session;

  if (!onion) {
    ctx.redirect('/browser-input');
    resolve();
    return;
  }

  const browsePath = ctx.params.browsePath || '';
  const targetPath = browsePath.startsWith('/') ? browsePath : `/${browsePath}`;
  const targetUrl = new URL(
    targetPath + (ctx.querystring ? `?${ctx.querystring}` : ''),
    `http://${onion}`,
  );

  // Clean headers (remove hop-by-hop)
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
  delete headers.cookie;

  headers['user-agent'] = 'OpenShop/0.0.0';

  headers.host = targetUrl.host;

  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port || 80,
    path: targetUrl.pathname + targetUrl.search,
    method: ctx.method,
    agent: socksAgent,
    timeout: TIMEOUT,
    headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    ctx.status = proxyRes.statusCode || 502;

    Object.entries(proxyRes.headers).forEach(([key, value]) => {
      if (value) { ctx.set(key, value); }
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
    ctx.body = 'ERROR';

    resolve();
  });

  if (['POST', 'PUT', 'PATCH'].includes(ctx.method) && ctx.req.readable) {
    ctx.req.pipe(proxyReq);
  } else {
    proxyReq.end();
  }
});
