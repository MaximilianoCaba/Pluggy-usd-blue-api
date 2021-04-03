import axios from "axios";
import cheerio from 'cheerio';


const getDollarBlue = async () => {
  const url = process.env.URL_DOLARHOY
  const pageContent = await axios.get(url);
  const $ = cheerio.load(pageContent.data);

  let response = {
    source: url,
    name: 'DOLARHOY'
  };

  $('div.tile.cotizacion_value').map((_, element) => {
    element = $(element);
    const values = element.find('div.value').map(function () {
      return $(this).text();
    }).get();
    response.buy_price = +parseFloat(values[0].replace('$', '')).toFixed(2);
    response.sell_price = +parseFloat(values[1].replace('$', '')).toFixed(2);
  }).get();
  return response;
}

export default {
  getDollarBlue,
};
