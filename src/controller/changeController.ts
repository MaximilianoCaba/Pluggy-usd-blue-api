import changeService from "../service/changeService";
import {FastifyReply, FastifyRequest} from "fastify";
import SlippageDto from "../dto/SlippageDto";
import AverageDto from "../dto/Average";
import QuoteDto from "../dto/QuoteDto";

const getQuotes = async (req: FastifyRequest, reply: FastifyReply) => {
  const quotes: QuoteDto[] = await changeService.getQuotes();
  reply.status(200).send(quotes);
};

const getAverage = async (req: FastifyRequest, reply: FastifyReply) => {
  const average: AverageDto = await changeService.getAverage();
  reply.status(200).send(average);
};

const getSlippage = async (req: FastifyRequest, reply: FastifyReply) => {
  const slippages: SlippageDto[] = await changeService.getSlippage();
  reply.status(200).send(slippages);
};
export default {
  getQuotes,
  getAverage,
  getSlippage
};
