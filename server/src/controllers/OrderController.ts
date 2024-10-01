import { FastifyReply, FastifyRequest } from 'fastify';

export class OrderController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    return reply.send([]);
  }
}
