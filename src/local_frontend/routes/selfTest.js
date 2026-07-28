/* eslint-disable import/no-unresolved */
import http from 'node:http';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { SELF_TEST_TIMEOUT } from '../../const.js';
import selfTestResult from '../pages/selfTestResult.js';

const socksAgent = new SocksProxyAgent(
  'socks5h://127.0.0.1:39050',
  { timeout: SELF_TEST_TIMEOUT },
);

export default (ctx) => new Promise((resolve) => {
  const onionHostname = 't4lhshlyxaaedovji2vx6ylyfvfpvbvq3poaajub5pyyull4f6ui6jyd.onion';

  if (!onionHostname) {
    ctx.status = 500;
    ctx.body = selfTestResult();
    resolve();

    return;
  }

  const targetUrl = new URL('/ruok', `http://${onionHostname}`);

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
    method: 'GET',
    agent: socksAgent,
    headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    ctx.status = proxyRes.statusCode || 500;
    ctx.body = selfTestResult({ result: true });

    proxyRes.resume();
    resolve();
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy(new Error('Upstream timeout'));
  });

  proxyReq.on('error', () => {
    ctx.status = 500;
    ctx.body = selfTestResult({ result: false });
    resolve();
  });

  proxyReq.end();
});
