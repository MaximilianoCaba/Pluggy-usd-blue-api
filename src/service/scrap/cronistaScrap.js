import axios from "axios";
import cheerio from 'cheerio';


const getDollarBlue = async () => {
  const url = process.env.URL_CRONISTA;
  const pageContent = await axios.get(url);
  const $ = cheerio.load(pageContent.data);

  let response = {
    source: url,
    name: 'CRONISTA'
  };

  $('section.piece.markets.standard.boxed').map((_, element) => {
    element = $(element);
    const buy_price = element.find('div.buy-value').text();
    const sell_price = element.find('div.sell-value').text();
    response.buy_price = +parseFloat(buy_price.replace('$', '').replace(',', '.')).toFixed(2);
    response.sell_price = +parseFloat(sell_price.replace('$', '').replace(',', '.')).toFixed(2);
  }).get();
  return response;
}

export default {
  getDollarBlue,
};
