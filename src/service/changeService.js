import dolarHoyScrap from './scrap/dolarHoyScrap';
import ambitoScrap from './scrap/ambitoScrap';
import cronistaScrap from './scrap/cronistaScrap';
import cacheManager from 'cache-manager';

const memoryCache = cacheManager.caching({store: 'memory', ttl: 86400});
const USD_CURRENCY = 'USD_CURRENCY'

const getQuotes = async () => {
  console.log('[changeService.getQuotes] get all quotes');
  let quotes = await memoryCache.get(USD_CURRENCY);
  if (!quotes) {
    console.log('[changeService.getQuotes] quotes not found in cache, generate new quotes');
    await setQuotes();
    quotes = await memoryCache.get(USD_CURRENCY)
  }
  console.log(`[changeService.getQuotes] return ${quotes.length} quotes`);
  return quotes;
}

const setQuotes = async () => {
  console.log('[changeService.setQuotes] generate new quotes');
  const result = [];
  const validateValue = (value) => {
    if (!isNaN(value.buy_price) && !isNaN(value.sell_price)) {
      console.log(`[changeService.setQuotes] push new scrap: ${ JSON.stringify(value)}`);
      result.push(value);
    } else {
      console.error(`[changeService.setQuotes] This currency crap is invalid: ${ JSON.stringify(value)}`);
    }
  }
  validateValue(await dolarHoyScrap.getDollarBlue());
  validateValue(await ambitoScrap.getDollarBlue());
  validateValue(await cronistaScrap.getDollarBlue());
  console.log(`[changeService.setQuotes] push cache with: ${result.length} result`);
  await memoryCache.set(USD_CURRENCY, result);
}

const getAverage = async () => {
  console.log(`[changeService.getAverage] get average`);
  const quotes = await getQuotes();
  const buy_average = quotes.reduce((accum, current) => accum + current.buy_price, 0) / quotes.length;
  const sell_average = quotes.reduce((accum, current) => accum + current.sell_price, 0) / quotes.length;
  return {
    average_buy_price: +buy_average.toFixed(2),
    average_sell_price: +sell_average.toFixed(2)
  }
}

const getSlippage = async () => {
  console.log(`[changeService.getSlippage] get getSlippage`);
  const quotes = await getQuotes();
  const {average_buy_price, average_sell_price} = await getAverage();
  const calculateSlippage = (average, price) => {
    console.log(`[changeService.getSlippage] calculate slippage with quotes and average`);
    const subtraction = average - price;
    const division = subtraction / price;
    const slippage = division * 100;
    return +slippage.toFixed(2);
  }
  return quotes.map(quote => {
    const {buy_price, sell_price} = quote;
    return {
      buy_price_slippage: calculateSlippage(average_buy_price, buy_price),
      sell_price_slippage: calculateSlippage(average_sell_price, sell_price),
      ...quote
    }
  });
}
const cacheReset = async () => {
  console.log(`[changeService.cacheReset] reset cache`);
  await memoryCache.reset();
}

export default {
  getQuotes,
  setQuotes,
  getAverage,
  getSlippage,
  cacheReset,
};
