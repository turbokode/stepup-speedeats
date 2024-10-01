import { FastifyInstance } from 'fastify';
import { OrderController } from '../Controllers/OrderController';
import { authHook } from '../hooks/auth';

const controller = new OrderController();

export async function orderRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authHook);
  fastify.post('/', (request, reply) => controller.create(request, reply));
  // fastify.register(authRoutes);
}

async function authRoutes(fastify: FastifyInstance) {}
