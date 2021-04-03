import dolarHoyScrap from './scrap/dolarHoyScrap';
import ambitoScrap from './scrap/ambitoScrap';
import cronistaScrap from './scrap/cronistaScrap';
import cacheManager from 'cache-manager';

const memoryCache = cacheManager.caching({store: 'memory', ttl: 86400});
const USD_CURRENCY = 'USD_CURRENCY'

const getQuotes = async () => {
  let quotes = await memoryCache.get(USD_CURRENCY);
  if (!quotes) {
    await setQuotes();
    quotes = await memoryCache.get(USD_CURRENCY)
  }
  return quotes;
}

const setQuotes = async () => {
  const result = [];
  const validateValue = (value) => {
    if (!isNaN(value.buy_price) && !isNaN(value.sell_price)) {
      result.push(value);
    } else {
      console.error('This currency crap is invalid: ', JSON.stringify(value));
    }
  }
  validateValue(await dolarHoyScrap.getDollarBlue());
  validateValue(await ambitoScrap.getDollarBlue());
  validateValue(await cronistaScrap.getDollarBlue());
  await memoryCache.set(USD_CURRENCY, result);
}

const getAverage = async () => {
  const quotes = await getQuotes();

  const buy_average = quotes.reduce((accum, current) => accum + current.buy_price, 0) / quotes.length;
  const sell_average = quotes.reduce((accum, current) => accum + current.sell_price, 0) / quotes.length;
  return {
    average_buy_price: +buy_average.toFixed(2),
    average_sell_price: +sell_average.toFixed(2)
  }
}

const getSlippage = async () => {
  const quotes = await getQuotes();
  const { average_buy_price, average_sell_price } = await getAverage();
  const calculateSlippage = (average, price) => {
    const subtraction = average - price;
    const division = subtraction / price;
    const slippage = division * 100;
    return +slippage.toFixed(2);
  }
  return quotes.map(quote => {
    const { buy_price, sell_price, ...other } = quote;
    return {
      buy_price_slippage: calculateSlippage(average_buy_price, buy_price),
      sell_price_slippage: calculateSlippage(average_sell_price, sell_price),
      ...other
    }
  });
}
const cacheReset = async () => {
  await memoryCache.reset();
}

export default {
  getQuotes,
  setQuotes,
  getAverage,
  getSlippage,
  cacheReset,
};
