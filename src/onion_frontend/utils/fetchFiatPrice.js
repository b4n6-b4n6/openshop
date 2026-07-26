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

export const extractMoneroPrices = (response) => {
  const prices = response?.monero ?? response?.data?.monero;
  return prices && typeof prices === 'object' ? prices : null;
};

const fetchFiatPrice = async () => {
  try {
    const response = await client.simplePrice({
      ids: 'monero',
      vs_currencies: CURRENCIES,
    });
    const result = extractMoneroPrices(response);
    if (!result) {
      console.error('CoinGecko returned no Monero prices', response);
    }
    return result;
  } catch (error) {
    console.error('Could not fetch the current Monero exchange rate', error);
    return null;
  }
};

export default createDebounced(fetchFiatPrice, FETCH_FIAT_PRICE_REMEMBER_FOR);
