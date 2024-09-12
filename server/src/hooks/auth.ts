import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../utils/env';
import { AppError } from '../errors/AppError';
import { z } from 'zod';

export function authHook(request: FastifyRequest, reply: FastifyReply, done: (error?: FastifyError) => void) {
  if (!request.headers.authorization) {
    throw new AppError('Authorization token not found', 401);
  }
  const [, token] = request.headers.authorization.split(' ');
  try {
    const PayloadSchema = z.object({
      id: z.string(),
      restaurantId: z.string().optional()
    });
    const { id, restaurantId = '' } = PayloadSchema.parse(jwt.verify(token, APP_SECRET));
    request.userId = id;
    request.restaurantId = restaurantId;
    done();
  } catch (error) {
    throw new AppError('Invalid Token', 401);
  }
}
