import cheerio from 'cheerio';
import puppeteerRepository from '../../repository/puppeteerRepository'

const getDollarBlue = async () => {
  const url = process.env.URL_AMBITO;
  console.log(`[ambitoScrap.getDollarBlue] get price with ${url}`);
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
  console.log(`[ambitoScrap.getDollarBlue] return with ${JSON.stringify(response)}`);
  return response;
}

export default {
  getDollarBlue,
};
