import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../db';
import { REPLServer } from 'repl';

interface UserProps {
  id?: string;
  email: string;
  name: string;
  password: string;
  phone?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserController {
  users = new Map();
  restaurants = new Map();
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password } = request.body as UserProps;

    const userExists = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (userExists) {
      return reply.status(400).send({ error: 'Usuario ja existe' });
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    });
    return reply.status(201).send();
  }

  async show(request: FastifyRequest, reply: FastifyReply) {
    interface RequestParamsProps {
      id: string;
    }
    const { id } = request.params as RequestParamsProps;

    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) {
      return reply.status(404).send({ error: 'Usuario nao encontrado' });
    }

    return reply.send(user);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    interface RequestParamsProps {
      id: string;
    }
    const { id } = request.params as RequestParamsProps;
    interface RequestBodyProps {
      email?: string;
      name?: string;
      phone?: number;
      address?: string;
      latitude?: number;
      longitude?: number;
    }
    const { email, address, latitude, longitude, name, phone } = request.body as RequestBodyProps;

    if (email) {
      const userExists = await prisma.user.findFirst({
        where: {
          email
        }
      });

      if (userExists?.email) {
        return reply.status(400).send({ error: 'Usuario ja existe' });
      }
    }

    const updatedUser = await prisma.user.update({
      data: {
        email,
        address,
        latitude,
        longitude,
        name,
        phone
      },
      where: {
        id
      }
    });
    return reply.send(updatedUser);
  }
}
