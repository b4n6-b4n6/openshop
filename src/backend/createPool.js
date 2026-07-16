import { Pool } from 'pg';

try {
  process.loadEnvFile();
} catch (error) {
  if (error.code !== 'ENOENT') { throw error; }
}

const createPool = () => new Pool();
export default createPool;
