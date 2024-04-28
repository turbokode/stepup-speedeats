import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../db';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/userRepository';
import { FileRepository } from '../repositories/fileRepository';

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
  #repository = new UserRepository();
  #fileRepository = new FileRepository();

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password } = request.body as UserProps;

    const userExists = await this.#repository.findByEmail(email);
    if (userExists) {
      return reply.status(400).send({ error: 'Usuario ja existe' });
    }

    const user = await this.#repository.save({ name, email, password });

    return reply.status(201).send(user);
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
    const { userId } = request;

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

      if (userExists) {
        return reply.status(400).send({ error: 'Usuario ja existe' });
      }
    }

    const updatedUser = await this.#repository.update(userId, { email, address, latitude, longitude, name, phone });
    return reply.send(updatedUser);
  }

  async changePassword(request: FastifyRequest, reply: FastifyReply) {
    interface RequestBodyProps {
      password: string;
    }
    const { password } = request.body as RequestBodyProps;
    const { userId } = request;

    await this.#repository.update(userId, { password });

    return reply.status(204).send({});
  }

  async updateAvatar(request: FastifyRequest, reply: FastifyReply) {
    interface RequestBodyProps {
      avatar: {
        filename: string;
        originalname: string;
      };
    }

    const { avatar } = request.body as RequestBodyProps;
    const { userId } = request;

    const savedFile = await this.#fileRepository.save({ filename: avatar.filename, originalname: avatar.originalname });
    const user = await this.#repository.update(userId, { avatarId: savedFile.id });

    return reply.send(user);
  }
}
