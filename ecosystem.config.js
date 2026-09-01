/* eslint-disable no-mixed-operators */

import os from 'node:os';
import process from 'node:process';

const isAndroid = process.platform === 'android';
const isLinux = process.platform === 'linux';

const optionalNodejsServices = [
  ...(isLinux ? [
    {
      name: 'notifier',
      script: 'yarn notifier',
      log_date_format: 'YYYY-MM-DDTHH:mm:ss',
    },
  ] : []),
  ...(isAndroid ? [
    {
      name: 'postgresql',
      script: './bin/termux/start-postgresql.sh',
    },
    {
      name: 'redis',
      script: './bin/termux/start-redis.sh',
    },
  ] : []),
]

export const apps = [
  {
    name: 'my-shop-onion-launcher',
    script: 'yarn my-shop-onion-launcher',
  },
  {
    name: 'tor-proxy',
    script: 'yarn tor-proxy',
  },
  {
    name: 'wallet-launcher',
    script: 'yarn wallet-launcher',
    log_date_format: 'YYYY-MM-DDTHH:mm:ss',
  },
  {
    name: 'local-frontend',
    script: 'yarn local-frontend',
    log_date_format: 'YYYY-MM-DDTHH:mm:ss',
  },
  {
    name: 'onion-frontend',
    script: 'yarn onion-frontend',
    log_date_format: 'YYYY-MM-DDTHH:mm:ss',
  },
  ...optionalNodejsServices,
];
