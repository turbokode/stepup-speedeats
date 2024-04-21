import { FastifyInstance } from 'fastify';
import AuthController from '../controllers/AuthController';

const authController = new AuthController();

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/', (request, reply) => authController.login(request, reply));
  fastify.post('/google', (request, reply) => authController.googleAuth(request, reply));
}
