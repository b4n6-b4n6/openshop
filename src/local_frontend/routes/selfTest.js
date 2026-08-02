/* eslint-disable import/no-unresolved */
import http from 'node:http';
import crypto from 'node:crypto';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { SELF_TEST_TIMEOUT } from '../../const.js';
import selfTestResult from '../pages/selfTestResult.js';

const RUOK_PATH = '/ruok';

const randomString = () => (
  crypto.randomBytes(4).toString('hex')
);

const createAgent = () => (
  new SocksProxyAgent(
    `socks5h://${randomString()}@127.0.0.1:39050`,
    { timeout: SELF_TEST_TIMEOUT },
  )
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
  delete headers.cookie;

  return headers;
};

export default (ctx) => new Promise((resolve) => {
  const onionHostname = ctx.onionSpinner.onion;

  if (!onionHostname) {
    ctx.status = 500;
    ctx.body = selfTestResult();
    resolve();

    return;
  }

  const targetUrl = new URL(RUOK_PATH, `http://${onionHostname}`);

  const headers = {
    ...purgeHeaders(ctx.headers),
    'user-agent': 'OpenShop/0.0.0',
    host: targetUrl.host,
  };

  const agent = createAgent();
  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port || 80,
    path: targetUrl.pathname + targetUrl.search,
    method: 'GET',
    agent,
    headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    ctx.status = proxyRes.statusCode || 500;
    ctx.body = selfTestResult({ result: true });

    agent.destroy();
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
