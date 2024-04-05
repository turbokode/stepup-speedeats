import { randomUUID } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';

export class RestaurantController {
  repository = new Map();

  create(request: FastifyRequest, reply: FastifyReply) {
    const { name, contact, slogan } = request.body;
    const id = randomUUID();
    this.repository.set(id, { name, contact, slogan });
    return reply.send({ status: 'success' });
  }

  list(request: FastifyRequest, reply: FastifyReply) {
    const restaurants = Array.from(this.repository);
    return reply.send(restaurants);
  }
}
