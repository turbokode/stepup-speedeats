import Fastify from 'fastify';
import { routes } from './routes';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './config/firebase';

initializeApp(firebaseConfig);

const fastify = Fastify({ logger: true });
fastify.register(routes, { prefix: '/api/v1' });
fastify.listen({ port: 3333 }).then(() => {
  console.log('Server running on 3333');
});
