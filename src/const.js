export const ONION_PATH = './my_shop_onion';
export const TORRC_PATH = './torrc/my_shop';

export const USER_CLAIM_TYPE = 'USER_CLAIM';
export const CURRENCIES = [
  'eur', 'usd', 'aud', 'nzd', 'gbp', 'cny', 'jpy', 'rub',
];

export const JWT_SECRET = (
  Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex')
);

export const BROWSED_ONION_COOKIE_NAME = 'browsed_onion';
export const JWT_COOKIE_NAME = 'jwt';

export const BROWSER_TIMEOUT = 30 * 1000;
export const FETCH_FIAT_PRICE_TIMEOUT = 20 * 1000;
export const FETCH_FIAT_PRICE_REMEMBER_FOR = 1000 * 60 * 5;
