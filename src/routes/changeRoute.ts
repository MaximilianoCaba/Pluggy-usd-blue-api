import changeController from '../controller/changeController';
import {FastifyInstance} from 'fastify';

export async function changeRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/quotes', changeController.getQuotes);
  fastify.get('/api/average', changeController.getAverage);
  fastify.get('/api/slippage', changeController.getSlippage);
}
