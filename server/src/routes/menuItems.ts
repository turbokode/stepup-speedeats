import { FastifyInstance } from 'fastify';
// import { RestaurantsController } from '../Controllers/RestaurantsController';
import { authHook } from '../hooks/auth';
import { uploadHook } from '../hooks/upload';
import { MenuItemsController } from '../Controllers/MenuItemsController';

// const restaurantsController = new RestaurantsController();
const controller = new MenuItemsController();

export async function menuItemRoutes(fastify: FastifyInstance) {
  fastify.register(authRoutes);
  fastify.get('/', (request, reply) => controller.list(request, reply));
  fastify.get('/:id', (request, reply) => controller.show(request, reply));
}

async function authRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authHook);
  fastify.post('/', { preHandler: uploadHook('image') }, (request, reply) => controller.create(request, reply));
  // fastify.post('/', { preHandler: uploadHook('image') }, (request, reply) =>
  //   restaurantsController.create(request, reply)
  // );
}
