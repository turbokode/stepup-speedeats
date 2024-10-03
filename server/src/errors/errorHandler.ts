import { FastifyInstance } from 'fastify';
import { AppError } from './AppError';
import { ZodError } from 'zod';
import { APP_ENV } from '../utils/env';

export const errorHandler: FastifyInstance['errorHandler'] = (error, request, reply) => {
  if (error instanceof AppError) return reply.status(error.statusCode).send({ message: error.message });
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.flatten().fieldErrors,
      error: APP_ENV === 'dev' ? error : undefined
    });
  }
  if (APP_ENV === 'dev') return reply.status(500).send(error);
  return reply.status(500).send({ message: 'Internal server error' });
};
