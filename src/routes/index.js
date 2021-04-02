import usdRoute from './usd/usdRoute';

const apiRoutes = async (app) => {
  app.register(usdRoute);
};

module.exports = apiRoutes;
