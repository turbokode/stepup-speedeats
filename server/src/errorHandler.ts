import { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from './errors/AppError';

export const errorHandler: FastifyInstance['errorHandler'] = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.flatten().fieldErrors
    });
  }

  if (error instanceof AppError) return reply.status(error.statusCode).send({ message: error.message });

  return reply.status(500).send({ message: 'Internal server error!' });
};
