import { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';

export class UserController {
  users = new Map();
  restaurants = new Map();
  create(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password } = request.body;
    const id = randomUUID();
    this.users.set(id, { name, email, password });
    return reply.status(201).send();
  }
}
