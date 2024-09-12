import { FastifyInstance } from 'fastify';
import { RestaurantsController } from '../Controllers/RestaurantsController';
import { authHook } from '../hooks/auth';
import { uploadHook } from '../hooks/upload';

const restaurantsController = new RestaurantsController();

export async function restaurantRoutes(fastify: FastifyInstance) {
  fastify.get('/', (request, reply) => restaurantsController.list(request, reply));
  fastify.get('/:id', (request, reply) => restaurantsController.show(request, reply));
  fastify.register(authRoutes);
}

async function authRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authHook);
  fastify.post('/', { preHandler: uploadHook('image') }, (request, reply) =>
    restaurantsController.create(request, reply)
  );
  fastify.put('/:id', { preHandler: uploadHook('image') }, (request, reply) =>
    restaurantsController.update(request, reply)
  );
}
