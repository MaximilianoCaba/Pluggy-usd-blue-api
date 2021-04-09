import ambitoScrap from './scrap/ambitoScrap';
import cronistaScrap from './scrap/cronistaScrap';
import cacheManager from 'cache-manager';
import dolarHoyScrap from "./scrap/dolarHoyScrap";
import QuoteDto from "../dto/QuoteDto";
import AverageDto from "../dto/Average";
import SlippageDto from "../dto/SlippageDto";

const memoryCache = cacheManager.caching({store: 'memory', ttl: 86400});
const USD_CURRENCY = 'USD_CURRENCY'

const getQuotes = async (): Promise<QuoteDto[]> => {
  console.log('[changeService.getQuotes] get all quotes');
  let quotes: QuoteDto[] | undefined = await memoryCache.get(USD_CURRENCY);
  if (!quotes) {
    console.log('[changeService.getQuotes] quotes not found in cache, generate new quotes');
    return await setQuotes();
  }
  console.log(`[changeService.getQuotes] return ${quotes.length} quotes`);
  return quotes;
}

const setQuotes = async (): Promise<QuoteDto[]> => {
  console.log('[changeService.setQuotes] generate new quotes');
  const result: QuoteDto[] = [];
  const validateValue = (value: QuoteDto )=> {
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
  return result;
}

const getAverage = async (): Promise<AverageDto> => {
  console.log(`[changeService.getAverage] get average`);
  const quotes: QuoteDto[] = await getQuotes();
  const buy_average = quotes.reduce((accum: number, current: QuoteDto) => accum + current.buy_price, 0) / quotes.length;
  const sell_average = quotes.reduce((accum: number, current: QuoteDto) => accum + current.sell_price, 0) / quotes.length;
  return {
    average_buy_price: +buy_average.toFixed(2),
    average_sell_price: +sell_average.toFixed(2)
  };
}

const getSlippage = async (): Promise<SlippageDto[]> => {
  console.log(`[changeService.getSlippage] get getSlippage`);
  const quotes: QuoteDto[] = await getQuotes();
  const {average_buy_price, average_sell_price} : AverageDto = await getAverage();
  const calculateSlippage = (average: number, price: number) => {
    console.log(`[changeService.getSlippage] calculate slippage with quotes and average`);
    const subtraction = average - price;
    const division = subtraction / price;
    const slippage = division * 100;
    return +slippage.toFixed(2);
  }
  return quotes.map((quote: QuoteDto) => {
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
