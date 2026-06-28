import { Pool } from 'pg';

const createPool = () => new Pool();
export default createPool;
