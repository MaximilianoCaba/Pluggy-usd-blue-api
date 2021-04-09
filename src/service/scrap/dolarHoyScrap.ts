import axios from "axios";
import cheerio from 'cheerio';
import QuoteDto from "../../dto/QuoteDto";

const getDollarBlue  = async () : Promise<QuoteDto> => {
  const url = process.env.URL_DOLARHOY;
  console.log(`[dolarHoyScrap.getDollarBlue] get price with ${url}`);
  const pageContent = await axios.get(`${url}`);
  const $ = cheerio.load(pageContent.data);

  const quote: QuoteDto = {
    name: 'DOLARHOY',
    source: `${url}`,
    buy_price: NaN,
    sell_price: NaN
  };

  $('div.tile.cotizacion_value').map((_, element) => {
    const values = $(element).find('div.value').map( (_, subElement) => {
      return $(subElement).text();
    }).get();
    quote.buy_price = +parseFloat(values[0].replace('$', '')).toFixed(2);
    quote.sell_price = +parseFloat(values[1].replace('$', '')).toFixed(2);
  }).get();
  console.log(`[dolarHoyScrap.getDollarBlue] return with ${JSON.stringify(quote)}`);

  return quote;
}

export default {
  getDollarBlue
};
