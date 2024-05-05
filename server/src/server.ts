import Fastify from 'fastify';
import { routes } from './routes';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './config/firebase';
import { API_PREFIX } from './utils/constants';
import { errorHandler } from './errorHandler';

initializeApp(firebaseConfig);

const fastify = Fastify({ logger: true });
fastify.register(routes, { prefix: API_PREFIX });

fastify.setErrorHandler(errorHandler);

fastify.listen({ port: 3333 }).then(() => {
  console.log('Server running on 3333');
});
