import { z } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { IngredientRepository } from '../repositories/ingredientRepository';

export class IngredientController {
  #repository = new IngredientRepository();
  async list(request: FastifyRequest, reply: FastifyReply) {
    const QuerySchema = z.object({
      name: z.string().optional()
    });

    const { name } = QuerySchema.parse(request.query);

    const ingredients = await this.#repository.list(name);

    return reply.send(ingredients);
  }
}
