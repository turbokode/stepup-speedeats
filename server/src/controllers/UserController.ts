import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../db';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/userRepository';
import { FileRepository } from '../repositories/fileRepository';
import { string, z } from 'zod';
import { AppError } from '../errors/AppError';

export class UserController {
  #repository = new UserRepository();
  #fileRepository = new FileRepository();

  async create(request: FastifyRequest, reply: FastifyReply) {
    const BodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8)
    });
    const { name, email, password } = BodySchema.parse(request.body);

    const userExists = await this.#repository.findByEmail(email);
    if (userExists) throw new AppError('Usuario ja existe');

    const user = await this.#repository.save({ name, email, password });

    return reply.status(201).send(user);
  }

  async show(request: FastifyRequest, reply: FastifyReply) {
    const ParamsSchema = z.object({
      id: z.string()
    });
    const { id } = ParamsSchema.parse(request.params);

    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) throw new AppError('Usuario nao encontrado', 404);

    return reply.send(user);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request;
    const BodySchema = z.object({
      email: z.string().email().optional(),
      address: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      name: z.string().optional(),
      phone: z.number().optional()
    });
    const { email, address, latitude, longitude, name, phone } = BodySchema.parse(request.body);

    if (email) {
      const userExists = await prisma.user.findFirst({
        where: {
          email
        }
      });

      if (userExists) throw new AppError('Usuario ja existe');
    }

    const updatedUser = await this.#repository.update(userId, { email, address, latitude, longitude, name, phone });
    return reply.send(updatedUser);
  }

  async changePassword(request: FastifyRequest, reply: FastifyReply) {
    const BodySchema = z.object({
      password: z.string().min(8)
    });
    const { password } = BodySchema.parse(request.body);
    const { userId } = request;

    await this.#repository.update(userId, { password });

    return reply.status(204).send({});
  }

  async updateAvatar(request: FastifyRequest, reply: FastifyReply) {
    const BodySchema = z.object({
      avatar: z.object({
        filename: z.string(),
        originalname: z.string()
      })
    });

    const { avatar } = BodySchema.parse(request.body);
    const { userId } = request;

    const savedFile = await this.#fileRepository.save({ filename: avatar.filename, originalname: avatar.originalname });
    const user = await this.#repository.update(userId, { avatarId: savedFile.id });

    return reply.send(user);
  }
}
