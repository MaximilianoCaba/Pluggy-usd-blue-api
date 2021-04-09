import fs from "fs";
import changeService from '../../src/service/changeService';

import axios, {AxiosResponse} from "axios";
jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

const axiosDto = (data: string) =>  {
  const axiosResponse: AxiosResponse = {
    data: data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {},
  }
  return axiosResponse;
};

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
    mockedAxios.get.mockClear();
    changeService.cacheReset();
  });

  describe('quote', () => {

    it('when 3 craps working, return 3 result', async (done) => {
      const mockedResponseDolarHoy: AxiosResponse = axiosDto(fs.readFileSync('test/resources/dolarHoy.html', 'utf8'));
      const mockedResponseCronista: AxiosResponse = axiosDto(fs.readFileSync('test/resources/cronista.html', 'utf8'));

      mockedAxios.get.mockResolvedValueOnce(mockedResponseDolarHoy);
      mockedAxios.get.mockResolvedValueOnce(mockedResponseCronista);

      const response = await changeService.getQuotes();

      console.log(response)
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


    it('when 2 craps working, return 2 result', async (done) => {
      const mockedResponseDolarHoy: AxiosResponse = axiosDto('<div></div>');
      const mockedResponseCronista: AxiosResponse = axiosDto(fs.readFileSync('test/resources/cronista.html', 'utf8'));

      mockedAxios.get.mockResolvedValueOnce(mockedResponseDolarHoy);
      mockedAxios.get.mockResolvedValueOnce(mockedResponseCronista);

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
      it('when 3 craps working, return average', async (done) => {
        const mockedResponseDolarHoy: AxiosResponse = axiosDto(fs.readFileSync('test/resources/dolarHoy.html', 'utf8'));
        const mockedResponseCronista: AxiosResponse = axiosDto(fs.readFileSync('test/resources/cronista.html', 'utf8'));

        mockedAxios.get.mockResolvedValueOnce(mockedResponseDolarHoy);
        mockedAxios.get.mockResolvedValueOnce(mockedResponseCronista);

        const response =  await changeService.getAverage();

        expect(response.average_buy_price).toBe(137.4);
        expect(response.average_sell_price).toBe(141.07);

        done()
      })

    });

    describe('slippage', () => {
      it('when 3 craps working, return slippage', async (done) => {
        const mockedResponseDolarHoy: AxiosResponse = axiosDto(fs.readFileSync('test/resources/dolarHoy.html', 'utf8'));
        const mockedResponseCronista: AxiosResponse = axiosDto(fs.readFileSync('test/resources/cronista.html', 'utf8'));

        mockedAxios.get.mockResolvedValueOnce(mockedResponseDolarHoy);
        mockedAxios.get.mockResolvedValueOnce(mockedResponseCronista);

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
