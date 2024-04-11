import { FastifyInstance } from 'fastify';
import { MenuItemsController } from '../controllers/MenuItemsController';
import { UserController } from '../controllers/UserController';
import { RestaurantController } from '../controllers/RestaurantController';

const menuItemsController = new MenuItemsController();
const userController = new UserController();
const restaurantController = new RestaurantController();

export async function routes(fastify: FastifyInstance) {
  fastify.get('/', (request, reply) => {
    return reply.send('Hello Fastify');
  });

  // fastify.get('/restaurants', (request, reply) => {
  //   const restaurantsArr = Array.from(restaurants);
  //   return reply.send(restaurantsArr);
  // });

  fastify.post('/users', (request, reply) => userController.create(request, reply));
  fastify.get('/users/:id', (request, reply) => userController.show(request, reply));
  fastify.put('/users/:id', (request, reply) => userController.update(request, reply));

  // Restaurants
  fastify.post('/restaurants', (request, reply) => restaurantController.create(request, reply));
  fastify.get('/restaurants', (request, reply) => restaurantController.list(request, reply));

  fastify.post('/menuItems', (request, reply) => menuItemsController.create(request, reply));

  fastify.get('/menuItems', (request, reply) => menuItemsController.list(request, reply));
}
