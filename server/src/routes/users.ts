import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/UserController';
import { authHook } from '../hooks/auth';
import { upload } from '../hooks/upload';

const userController = new UserController();

export async function userRoutes(fastify: FastifyInstance) {
  fastify.register(authRoutes);
  fastify.post('/', (request, reply) => userController.create(request, reply));
}

async function authRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authHook);
  fastify.put('/', (request, reply) => userController.update(request, reply));
  fastify.patch('/password', (request, reply) => userController.changePassword(request, reply));
  fastify.patch('/avatar', { preHandler: [upload('avatar')] }, (request, reply) =>
    userController.updateAvatar(request, reply)
  );
}
