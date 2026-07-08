import { randomUUID } from 'node:crypto';
import { USER_CLAIM_TYPE } from '../../const.js';
import sign from './sign.js';

export default () => (
  sign(
    {
      type: USER_CLAIM_TYPE,
      userId: randomUUID(),
    },
    {},
  )
);
