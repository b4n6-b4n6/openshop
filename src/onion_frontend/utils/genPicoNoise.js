import crypto from 'node:crypto';

export default () => (
  crypto.randomInt(1000000)
);
