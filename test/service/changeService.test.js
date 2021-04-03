import mockAxios from 'axios';
import fs from "fs";
import changeService from '../../src/service/changeService';

jest.mock('../../src/repository/puppeteerRepository', () => ({
  getHtml: () => '<div class="variacion-max-min indicador" data-indice="/dolar/informal" data-ep="/variacion" data-url="https://mercados.ambito.com/">\n' +
   '<span class="date"><span class="online"> Online al</span>  <span class="date-time data-fecha">31/03/2021 - 16:32</span>  </span>  ' +
   '<div class="percent-content">  <span class="description">variación</span>  <span class="percent data-class-variacion data-variacion equal">0,00%</span>  </div>  ' +
   '<div class="first">  <span class="description">compra</span>  <span class="value data-compra">136,10</span>  </div>  ' +
   '<div class="second">  <span class="description">venta</span>  <span class="value data-venta">141,05</span>  </div></div>\n' +
   '</div>  <div class="col-12 col-sm-3">',
}));

describe('Change Service Tests', () => {
  beforeEach(() => {
    mockAxios.get.mockClear();
    changeService.cacheReset();
  });

  describe('quote', () => {

    test('when 3 craps working, return 3 result', async (done) => {

      mockAxios.get.mockResolvedValueOnce({
        data: fs.readFileSync('test/resources/dolarHoy.html', 'utf8'),
      });

      mockAxios.get.mockResolvedValueOnce({
        data: fs.readFileSync('test/resources/cronista.html', 'utf8'),
      });

      const response =  await changeService.getQuotes();

      expect(response.length).toBe(3);

      expect(response[0].buy_price).not.toBe(null);
      expect(response[0].sell_price).not.toBe(null);
      expect(response[0].name).toBe('DOLARHOY');

      expect(response[1].buy_price).not.toBe(null);
      expect(response[1].sell_price).not.toBe(null);
      expect(response[1].name).toBe('AMBITO');

      expect(response[2].buy_price).not.toBe(null);
      expect(response[2].sell_price).not.toBe(null);
      expect(response[2].name).toBe('CRONISTA');

      done()
    })

    test('when 2 craps working, return 2 result', async (done) => {

      mockAxios.get.mockResolvedValueOnce({
        data: '<div></div>',
      });

      mockAxios.get.mockResolvedValueOnce({
        data: fs.readFileSync('test/resources/cronista.html', 'utf8'),
      });

      const response =  await changeService.getQuotes();

      console.log(response)
      expect(response.length).toBe(2);

      expect(response[0].buy_price).not.toBe(null);
      expect(response[0].sell_price).not.toBe(null);
      expect(response[0].name).toBe('AMBITO');

      expect(response[1].buy_price).not.toBe(null);
      expect(response[1].sell_price).not.toBe(null);
      expect(response[1].name).toBe('CRONISTA');

      done()
    })
  });

  describe('average', () => {
    test('when 3 craps working, return average', async (done) => {

      mockAxios.get.mockResolvedValueOnce({
        data: fs.readFileSync('test/resources/dolarHoy.html', 'utf8'),
      });

      mockAxios.get.mockResolvedValueOnce({
        data: fs.readFileSync('test/resources/cronista.html', 'utf8'),
      });

      const response =  await changeService.getAverage();

      expect(response.average_buy_price).toBe(137.4);
      expect(response.average_sell_price).toBe(141.07);

      done()
    })

  });

  describe('slippage', () => {
    test('when 3 craps working, return slippage', async (done) => {

      mockAxios.get.mockResolvedValueOnce({
        data: fs.readFileSync('test/resources/dolarHoy.html', 'utf8'),
      });

      mockAxios.get.mockResolvedValueOnce({
        data: fs.readFileSync('test/resources/cronista.html', 'utf8'),
      });

      const response =  await changeService.getSlippage();

      expect(response.length).toBe(3);

      expect(response[0].buy_price_slippage).toBe(-0.51);
      expect(response[0].sell_price_slippage).toBe(-0.06);
      expect(response[0].name).toBe('DOLARHOY');

      expect(response[1].buy_price_slippage).toBe(0.96);
      expect(response[1].sell_price_slippage).toBe(0.01);
      expect(response[1].name).toBe('AMBITO');

      expect(response[2].buy_price_slippage).toBe(-0.43);
      expect(response[2].sell_price_slippage).toBe(0.05);
      expect(response[2].name).toBe('CRONISTA');

      done()
    })

  });
});
