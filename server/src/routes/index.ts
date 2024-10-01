import { FastifyInstance } from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { userRoutes } from './user';
import { UPLOADS_DIR } from '../utils/constants';
import { authRoutes } from './auth';
import { restaurantRoutes } from './restaurants';
import { menuItemRoutes } from './menuItems';
import { ingredientRoutes } from './ingredients';
import { orderRoutes } from './orders';

export async function routes(fastify: FastifyInstance) {
  fastify.register(fastifyMultipart, { attachFieldsToBody: true });
  fastify.register(fastifyStatic, {
    root: UPLOADS_DIR,
    prefix: '/public'
  });

  fastify.decorateRequest('userId', '');
  fastify.decorateRequest('restaurantId', '');
  fastify.get('/', (request, reply) => {
    return reply.send('Hello Fastify');
  });

  fastify.register(userRoutes, {
    prefix: '/users'
  });
  fastify.register(authRoutes, {
    prefix: '/auth'
  });
  fastify.register(restaurantRoutes, {
    prefix: '/restaurants'
  });
  fastify.register(menuItemRoutes, {
    prefix: '/menu-items'
  });
  fastify.register(ingredientRoutes, {
    prefix: '/ingredients'
  });

  fastify.register(orderRoutes, {
    prefix: '/orders'
  });
}
