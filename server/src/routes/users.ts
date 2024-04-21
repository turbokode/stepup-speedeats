import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/UserController';
import { authHook } from '../hooks/auth';

const userController = new UserController();

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/', (request, reply) => userController.create(request, reply));
  // fastify.get('/:id', (request, reply) => userController.show(request, reply));
  fastify.put('/', { preHandler: authHook }, (request, reply) => userController.update(request, reply));
  fastify.patch('/password', { preHandler: authHook }, (request, reply) => userController.changePassword(request, reply));
}
