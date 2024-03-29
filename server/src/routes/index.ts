import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';
import { MenuItemsController } from '../controllers/MenuItemsController';

const menuItemsController = new MenuItemsController();

const users = new Map();
const restaurants = new Map();

export async function routes(fastify: FastifyInstance) {
  fastify.get('/', (request, reply) => {
    return reply.send('Hello Fastify');
  });

  fastify.get('/restaurants', (request, reply) => {
    const restaurantsArr = Array.from(restaurants);
    return reply.send(restaurantsArr);
  });

  fastify.post('/users', (request, reply) => {
    const { name, email, password, isRestaurant = false, restaurantName, restaurantContact } = request.body;

    const id = randomUUID();
    let restaurantId;
    if (isRestaurant) {
      restaurantId = randomUUID();
      restaurants.set(restaurantId, { name: restaurantName, contact: restaurantContact });
    }
    users.set(id, { name, email, password, restaurantId });
    return reply.status(201).send();
  });

  fastify.post('/menuItems', (request, reply) => menuItemsController.create(request, reply));

  fastify.get('/menuItems', (request, reply) => menuItemsController.list(request, reply));
}
