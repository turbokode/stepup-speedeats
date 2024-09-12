import { FastifyInstance } from 'fastify';
import { IngredientController } from '../Controllers/IngredientController';

const controller = new IngredientController();

export async function ingredientRoutes(fastify: FastifyInstance) {
  fastify.get('/', (request, reply) => controller.list(request, reply));
}
