import { CoinGeckoClient } from 'coingecko-api-v3';
import createDebounced from './createDebounced.js';
import {
  CURRENCIES,
  FETCH_FIAT_PRICE_REMEMBER_FOR,
  FETCH_FIAT_PRICE_TIMEOUT,
} from '../../const.js';

const client = new CoinGeckoClient({
  timeout: FETCH_FIAT_PRICE_TIMEOUT,
});
const fetchFiatPrice = async () => {
  const response = await client.simplePrice({
    ids: 'monero',
    vs_currencies: CURRENCIES,
  });

  if (!response.success) {
    console.error(response.data);
    return null;
  }

  const result = response.data?.monero;

  if (!result) {
    console.error(result);
    return null;
  }

  return result;
};

export default createDebounced(fetchFiatPrice, FETCH_FIAT_PRICE_REMEMBER_FOR);
