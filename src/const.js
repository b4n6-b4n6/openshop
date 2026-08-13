import createOrLoadJwtSecret from './utils/createOrLoadJwtSecret.js';

export const USER_CLAIM_TYPE = 'USER_CLAIM';

export const MY_SHOP_ONION_PATH = './my_shop_onion/hostname';
export const MY_SHOP_TORRC_PATH = './torrc/my_shop';
export const MY_SHOP_WALLET_PATH = './wallet/wallet';

export const JWT_SECRET = await createOrLoadJwtSecret();

export const BROWSED_ONION_COOKIE_NAME = 'browsed_onion';
export const JWT_COOKIE_NAME = 'jwt';

export const BROWSER_TIMEOUT = 24 * 1000;
export const SELF_TEST_TIMEOUT = 12 * 1000;
export const FETCH_FIAT_PRICE_TIMEOUT = 20 * 1000;
export const FETCH_FIAT_PRICE_REMEMBER_FOR = 5 * 60 * 1000;

export const ORDERS_PAGE_REFRESH = 12;
export const CONVOS_PAGE_REFRESH = 6;
export const ORDER_PAGE_REFRESH = 12;
export const CONVO_PAGE_REFRESH = 6;
export const BROWSER_ERROR_REFRESH = 16;

export const MY_SHOP_ONION_LAUNCH_IPC = '.ipc/my_shop_onion_launch';
export const MY_SHOP_ONION_PROGRESS_IPC = '.ipc/my_shop_onion_progress';
export const MY_SHOP_WALLET_SYNC_STATUS_IPC = '.ipc/my_shop_wallet_sync_status_ipc';

export const MONERO_RPC_URI = 'https://corny.cc';

export const CURRENCIES = [
  'eur', 'usd', 'aud', 'nzd', 'gbp', 'cny', 'jpy', 'rub',
];

export const UPLOAD_FILE_MAX_SIZE = 10 * 1024 * 1024;
export const UPLOAD_FORM_MAX_SIZE = 8 * 1024 * 1024;

export const CONVO_IMAGE_THUMB_WIDTH = 280;
export const CONVO_IMAGE_THUMB_HEIGHT = 210;

export const CACHE_CONTROL_LIVE = 'no-cache';
export const CACHE_CONTROL_FOREVER = 'immutable';

export const THUMB_CACHE_KEY = {
  PROFILE: 'PROFILE',
  BANNER: 'BANNER',
  ORDER: 'ORDER',
  PRODUCT: 'PRODUCT',
  MESSAGE: 'MESSAGE',
  MESSAGE_BLUR: 'MESSAGE_BLUR',
};

export const THUMB_CACHE_SIZE = {
  PROFILE: 72,
  BANNER: 480,
  ORDER: 64,
  PRODUCT: 64,
  MESSAGE: [280, 35],
  MESSAGE_BLUR: [24, 15],
};
