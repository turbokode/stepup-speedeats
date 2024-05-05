import path from 'path';
import { FastifyInstance } from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { MenuItemsController } from '../controllers/MenuItemsController';
import { RestaurantController } from '../controllers/RestaurantController';
import { userRoutes } from './users';
import { authRoutes } from './auth';
import { UPLOADS_DIR } from '../utils/constants';

const menuItemsController = new MenuItemsController();
const restaurantController = new RestaurantController();

export async function routes(fastify: FastifyInstance) {
  fastify.decorateRequest('userId', '');
  fastify.register(fastifyMultipart, { attachFieldsToBody: true });
  fastify.register(fastifyStatic, {
    root: UPLOADS_DIR,
    prefix: '/public/'
  });
  fastify.register(userRoutes, { prefix: '/users' });
  fastify.register(authRoutes, { prefix: '/auth' });

  fastify.get('/', async (request, reply) => {
    return reply.send('Hello Fastify');
  });

  // Restaurants
  fastify.post('/restaurants', (request, reply) => restaurantController.create(request, reply));
  fastify.get('/restaurants', (request, reply) => restaurantController.list(request, reply));

  fastify.post('/menuItems', (request, reply) => menuItemsController.create(request, reply));

  fastify.get('/menuItems', (request, reply) => menuItemsController.list(request, reply));
}
