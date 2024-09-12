import 'dotenv/config';
import Fastify from 'fastify';
import { routes } from './Routes';
import { initializeApp } from 'firebase/app';
import { errorHandler } from './errors/errorHandler';
import { firebaseConfig } from './config/firebase';
import { API_PREFIX } from './utils/constants';
import { PORT } from './utils/env';

initializeApp(firebaseConfig);

const fastify = Fastify({ logger: true });

fastify.register(routes, { prefix: API_PREFIX });

fastify.setErrorHandler(errorHandler);

fastify.listen({ port: PORT }).then(() => {
  console.log(`Server running on port ${PORT}`);
});
