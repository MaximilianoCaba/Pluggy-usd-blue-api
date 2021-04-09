import cheerio from 'cheerio';
import puppeteerRepository from '../../repository/puppeteerRepository'
import QuoteDto from "../../dto/QuoteDto";

const getDollarBlue = async () => {
  const url = process.env.URL_AMBITO;
  console.log(`[ambitoScrap.getDollarBlue] get price with ${url}`);

  const quote: QuoteDto = {
    name: 'AMBITO',
    source: `${url}`,
    buy_price: NaN,
    sell_price: NaN
  };

  const bodyHTML: string = await puppeteerRepository.getHtml(`${url}`);
  const $ = cheerio.load(bodyHTML);

  $('div.variacion-max-min.indicador').map((_, element) => {
    const buy_price = $(element).find('span.value.data-compra').text();
    const sell_price = $(element).find('span.value.data-venta').text();
    quote.buy_price = +parseFloat(buy_price.replace(',', '.')).toFixed(2);
    quote.sell_price = +parseFloat(sell_price.replace(',', '.')).toFixed(2);
  }).get();
  console.log(`[ambitoScrap.getDollarBlue] return with ${JSON.stringify(quote)}`);
  return quote;
}

export default {
  getDollarBlue,
};
