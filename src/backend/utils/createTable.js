import isTest from '../../utils/isTest.js';

const CREATE_TABLE = (
  isTest
    ? 'CREATE TEMPORARY TABLE'
    : 'CREATE TABLE IF NOT EXISTS'
);

export default CREATE_TABLE;
