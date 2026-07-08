import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../const.js';

export default (payload, options) => (
  jwt.sign(
    payload,
    JWT_SECRET,
    options,
  )
);
