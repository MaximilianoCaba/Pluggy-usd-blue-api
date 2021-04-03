import changeRoute from './change/changeRoute';

const apiRoutes = async (app) => {
  app.register(changeRoute);
};

module.exports = apiRoutes;
