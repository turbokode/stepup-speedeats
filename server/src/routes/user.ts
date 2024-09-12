import { FastifyInstance } from 'fastify';
import { UsersController } from '../Controllers/UsersController';
import { authHook } from '../hooks/auth';
import { uploadHook } from '../hooks/upload';
const usersController = new UsersController();

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/', (request, reply) => usersController.create(request, reply));
  fastify.register(authRoutes);
}

async function authRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authHook);
  fastify.put('/', (request, reply) => usersController.update(request, reply));
  fastify.patch('/password', (request, reply) => usersController.changePass(request, reply));
  fastify.patch('/avatar', { preHandler: uploadHook('avatar') }, (request, reply) =>
    usersController.uploadAvatar(request, reply)
  );
}
