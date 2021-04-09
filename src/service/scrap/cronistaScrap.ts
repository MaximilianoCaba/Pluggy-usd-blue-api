import axios from "axios";
import cheerio from 'cheerio';
import QuoteDto from "../../dto/QuoteDto";

const getDollarBlue = async () => {
  const url = process.env.URL_CRONISTA;
  console.log(`[cronicaScrap.getDollarBlue] get price with ${url}`);
  const pageContent = await axios.get(`${url}`);
  const $ = cheerio.load(pageContent.data);

  const quote: QuoteDto = {
    name: 'CRONISTA',
    source: `${url}`,
    buy_price: NaN,
    sell_price: NaN
  };

  $('section.piece.markets.standard.boxed').map((_, element) => {
    const buy_price = $(element).find('div.buy-value').text();
    const sell_price = $(element).find('div.sell-value').text();
    quote.buy_price = +parseFloat(buy_price.replace('$', '').replace(',', '.')).toFixed(2);
    quote.sell_price = +parseFloat(sell_price.replace('$', '').replace(',', '.')).toFixed(2);
  }).get();
  console.log(`[cronicaScrap.getDollarBlue] return with ${JSON.stringify(quote)}`);
  return quote;
}

export default {
  getDollarBlue,
};
