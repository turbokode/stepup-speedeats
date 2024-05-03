import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../utils/env';

interface PayloadProps {
  id: string;
}

export function authHook(request: FastifyRequest, reply: FastifyReply, done: (err?: FastifyError) => void) {
  if (!request.headers.authorization) return reply.status(401).send({ error: 'User is not logged in' });

  const [, token] = request.headers.authorization.split(' ');
  try {
    const { id } = jwt.verify(token, APP_SECRET) as PayloadProps;
    request.userId = id;
  } catch (err) {
    return reply.status(401).send({ error: 'Invalid token' });
  }
  done();
}
