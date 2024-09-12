import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';
import { prisma } from '../bd';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/userRepository';
import fs from 'node:fs';
import { pipeline } from 'node:stream';
import util from 'node:util';
import { FileRepository } from '../repositories/fileRepository';
import { z } from 'zod';
import { AppError } from '../errors/AppError';
const pump = util.promisify(pipeline);

export class UsersController {
  userRepository = new UserRepository();
  fileRepository = new FileRepository();

  async create(request: FastifyRequest, reply: FastifyReply) {
    const RequestBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8)
    });
    const { name, email, password } = RequestBodySchema.parse(request.body);
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new AppError('Usuário ja existe');
    }

    const user = await this.userRepository.save({ name, email, password });

    return reply.status(201).send({
      ...user,
      password: undefined
    });
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId;

    const BodySchema = z.object({
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string(),
      address: z.string().optional(),
      latitude: z.string().optional(),
      longitude: z.string().optional()
    });
    const { email, address, latitude, longitude, name, phone } = BodySchema.parse(request.body);

    if (email) {
      const userExists = await this.userRepository.findByEmail(email);
      if (userExists) {
        throw new AppError('Usuário ja existe');
      }
    }

    const updateUser = await this.userRepository.update(userId, { email, address, latitude, longitude, name, phone });
    return reply.send(updateUser);
  }

  async changePass(request: FastifyRequest, reply: FastifyReply) {
    const BodySchema = z.object({
      password: z.string().min(8)
    });
    const { password } = BodySchema.parse(request.body);
    const userId = request.userId;
    const updatedPassword = await this.userRepository.update(userId, { password });
    return reply.send(updatedPassword);
  }

  async uploadAvatar(request: FastifyRequest, reply: FastifyReply) {
    const BodySchema = z.object({
      avatar: z.object({
        filename: z.string(),
        originalname: z.string()
      })
    });

    const { avatar } = BodySchema.parse(request.body);
    const { userId } = request;

    const savedFile = await this.fileRepository.save(avatar);
    await this.userRepository.update(userId, { avatarId: savedFile.id });
    return reply.send(savedFile);
  }
}
