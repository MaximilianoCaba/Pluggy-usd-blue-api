import changeService from "../service/changeService";

const getQuotes = async (req, reply) => {
  const response = await changeService.getQuotes();
  reply.status(200).send(response);
};

const getAverage = async (req, reply) => {
  const response = await changeService.getAverage();
  reply.status(200).send(response);
};

const getSlippage = async (req, reply) => {
  const response = await changeService.getSlippage();
  reply.status(200).send(response);
};
export default {
  getQuotes,
  getAverage,
  getSlippage
};
