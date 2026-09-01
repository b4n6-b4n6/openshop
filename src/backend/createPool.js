import { Pool } from 'pg';
import isTest from '../utils/isTest.js';

const createPool = () => new Pool({
  database: isTest ? 'test' : undefined,
  host: '/var/run/postgresql',
});
export default createPool;
