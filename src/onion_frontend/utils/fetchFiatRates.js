/* eslint-disable preserve-caught-error */
import { CoinGeckoClient } from 'coingecko-api-v3';
import {
  CURRENCIES,
  FETCH_FIAT_PRICE_REMEMBER_FOR,
  FETCH_FIAT_PRICE_TIMEOUT,
} from '../../const.js';

const client = new CoinGeckoClient({
  timeout: FETCH_FIAT_PRICE_TIMEOUT,
});

const createDebounced = (func, rememberFor) => { //  TODO
  let lastResult;
  let lastCheckTime;

  return async () => {
    const now = Date.now();

    if (!lastCheckTime || now - lastCheckTime > rememberFor) {
      lastResult = func();
      lastCheckTime = now;

      try {
        await lastResult;
      } catch (err) {
        lastResult = null;
        lastCheckTime = null;
        throw err;
      }
    }

    return lastResult;
  };
};

const fetchFiatRates = async () => {
  try {
    return (
      (await client.simplePrice({
        ids: 'monero',
        vs_currencies: CURRENCIES,
      })).monero
    );
  } catch (err) {
    console.error(err);
    throw new Error('failed to fetch fiat prices');
  }
};

export default createDebounced(fetchFiatRates, FETCH_FIAT_PRICE_REMEMBER_FOR);
