import changeController from '../../controller/changeController';

const changeRoute = async (app) => {
  app.get('/api/quotes', { handler: changeController.getQuotes });

  app.get('/api/average', { handler: changeController.getAverage });

  app.get('/api/slippage', { handler: changeController.getSlippage });
};


module.exports = changeRoute;
