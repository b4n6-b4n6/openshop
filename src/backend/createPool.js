import os from 'node:os';
import process from 'node:process';
import { Pool } from 'pg';
import isTest from '../utils/isTest.js';

const isAndroid = process.platform === 'android';
const isLinux = process.platform === 'linux';
const pgEnv = {
  ...(isAndroid ? {
    user: os.userInfo().username,
    host: `${process.env.PREFIX}/tmp`,
  } : {}),
  ...(isLinux ? {
    host: '/var/run/postgresql',
  } : {}),
};

const createPool = () => new Pool({
  database: isTest ? 'test' : undefined,
  ...pgEnv,
});

export default createPool;
