import usdController from '../../controller/usdController';

const urlRoute = async (app) => {
  app.get('/api/average', { handler: usdController.getAverage });
};

module.exports = urlRoute;
