import { FastifyInstance } from 'fastify';
import { OrderController } from '../Controllers/OrderController';
import { authHook } from '../hooks/auth';

const controller = new OrderController();

export async function orderRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authHook);
  fastify.post('/', (request, reply) => controller.create(request, reply));
  fastify.post('/:id/payments', (request, reply) => controller.makePayment(request, reply));
  fastify.patch('/:id/delivered', (request, reply) => controller.setOrderAsDelivered(request, reply));
  fastify.delete('/:id', (request, reply) => controller.cancelOrder(request, reply));
  fastify.get('/restaurants', (request, reply) => controller.listRestaurantOrders(request, reply));
  fastify.get('/customers', (request, reply) => controller.listCustomerOrders(request, reply));
  fastify.get('/:id', (request, reply) => controller.show(request, reply));
}
