import Pg from 'pg';
import isTest from '../utils/isTest';

const { Pool } = Pg;

const createPool = () => new Pool({
  database: isTest ? 'test' : undefined,
});
export default createPool;
