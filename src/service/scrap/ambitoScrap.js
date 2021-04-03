import cheerio from 'cheerio';
import puppeteerRepository from '../../repository/puppeteerRepository'

const getDollarBlue = async () => {
  const url = process.env.URL_AMBITO;
  let response = {
    source: url,
    name: 'AMBITO'
  };

  const bodyHTML = await puppeteerRepository.getHtml(url);

  const $ = cheerio.load(bodyHTML);

  $('div.variacion-max-min.indicador').map((_, element) => {
    element = $(element);
    const buy_price = element.find('span.value.data-compra').text();
    const sell_price = element.find('span.value.data-venta').text();
    response.buy_price = +parseFloat(buy_price.replace(',', '.')).toFixed(2);
    response.sell_price = +parseFloat(sell_price.replace(',', '.')).toFixed(2);
  }).get();
  return response;
}

export default {
  getDollarBlue,
};
