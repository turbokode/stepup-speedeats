import { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';
import { prisma } from '../db';

export class UserController {
  users = new Map();
  restaurants = new Map();
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password } = request.body;

    await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    });
    return reply.status(201).send();
  }
}
