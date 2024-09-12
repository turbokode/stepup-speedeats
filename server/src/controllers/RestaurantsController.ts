import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { timeFormatRegex } from '../utils/utils';
import { FileRepository } from '../repositories/fileRepository';
import { RestaurantRepository } from '../repositories/restaurantRepository';
import { AppError } from '../errors/AppError';

export class RestaurantsController {
  repository = new RestaurantRepository();
  fileRepository = new FileRepository();

  async create(request: FastifyRequest, reply: FastifyReply) {
    const BodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      address: z.string().optional(),
      latitude: z.coerce.number(),
      longitude: z.coerce.number(),
      openTime: z.string().refine((str) => timeFormatRegex.test(str), {
        message: 'Invalid time format. Must be HH:MM'
      }),
      closeTime: z.string().refine((str) => timeFormatRegex.test(str), {
        message: 'Invalid time format. Must be HH:MM'
      }),
      slogan: z.string(),
      phone: z.string(),
      email: z.string().email(),
      image: z.object({
        filename: z.string(),
        originalname: z.string()
      })
    });
    const { name, phone, slogan, closeTime, email, image, latitude, longitude, openTime, address, description } =
      BodySchema.parse(request.body);
    const userId = request.userId;

    const savedFile = await this.fileRepository.save(image);

    const savedRestaurant = await this.repository.save({
      name,
      phone,
      slogan,
      closeTime,
      email,
      imageId: savedFile.id,
      latitude,
      longitude,
      openTime,
      address,
      description,
      createdBy: userId
    });

    return reply.status(201).send(savedRestaurant);
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const QuerySchema = z.object({
      name: z.string().optional(),
      page: z.coerce.number().optional()
    });
    const { name, page = 0 } = QuerySchema.parse(request.query);
    const restaurants = await this.repository.list({ name, page });
    return reply.send(restaurants);
  }

  async show(request: FastifyRequest, reply: FastifyReply) {
    const ParamsSchema = z.object({
      id: z.string()
    });
    const { id } = ParamsSchema.parse(request.params);

    const restaurant = await this.repository.findById(id);

    return reply.send(restaurant);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const BodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      address: z.string().optional(),
      latitude: z.coerce.number().optional(),
      longitude: z.coerce.number().optional(),
      openTime: z
        .string()
        .optional()
        .refine((str) => (str ? timeFormatRegex.test(str) : true), {
          message: 'Invalid time format. Must be HH:MM'
        }),
      closeTime: z
        .string()
        .optional()
        .refine((str) => (str ? timeFormatRegex.test(str) : true), {
          message: 'Invalid time format. Must be HH:MM'
        }),
      slogan: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      image: z
        .object({
          filename: z.string(),
          originalname: z.string()
        })
        .optional()
    });
    const { name, phone, slogan, closeTime, email, image, latitude, longitude, openTime, address, description } =
      BodySchema.parse(request.body);
    const restaurantId = request.restaurantId;
    if (email) {
      const restaurantExists = await this.repository.findByEmail(email);
      if (restaurantExists) {
        throw new AppError('Restaurante ja existe');
      }
    }

    let savedFile = undefined;

    if (image) savedFile = await this.fileRepository.save(image);

    const updatedRestaurant = await this.repository.update(restaurantId, {
      name,
      phone,
      slogan,
      closeTime,
      email,
      imageId: savedFile ? savedFile.id : savedFile,
      latitude,
      longitude,
      openTime,
      address,
      description
    });

    return reply.send(updatedRestaurant);
  }
}
