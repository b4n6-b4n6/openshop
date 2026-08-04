import crypto from 'node:crypto';

export default () => (
  crypto.randomInt(1e6)
);
