import Fastify from 'fastify';
import { routes } from './routes';

const fastify = Fastify({});

fastify.register(routes);

fastify.listen({ port: 3333 }).then(() => {
  console.log('Server running on 3333');
});
