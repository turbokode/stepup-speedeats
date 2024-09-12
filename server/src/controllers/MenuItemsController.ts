import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { timeFormatRegex } from '../utils/utils';
import { MenuItemRepository } from '../repositories/menuItemRepository';
import { FileRepository } from '../repositories/fileRepository';
import { AppError } from '../errors/AppError';

export class MenuItemsController {
  #repository = new MenuItemRepository();
  fileRepository = new FileRepository();

  async create(request: FastifyRequest, reply: FastifyReply) {
    const menuItemSchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      price: z.coerce.number(),
      prepareTime: z.string().refine((str) => timeFormatRegex.test(str), {
        message: 'Invalid time format. Must be HH:MM'
      }),
      image: z.object({
        filename: z.string(),
        originalname: z.string()
      }),
      newIngredients: z.string().array(),
      ingredients: z.string().array(),
    });
    const { name, price, description, image, prepareTime, newIngredients, ingredients } = menuItemSchema.parse(request.body);
    const { restaurantId } = request;
    const savedFile = await this.fileRepository.save(image);

    const savedMenuItem = await this.#repository.save({
      restaurantId,
      name,
      price,
      description,
      prepareTime,
      imageId: savedFile.id,
      newIngredients,
      ingredients
    });

    return reply.status(201).send(savedMenuItem);
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const QuerySchema = z.object({
      name: z.string().optional(),
      page: z.coerce.number().optional()
    });
    const { name, page = 0 } = QuerySchema.parse(request.query);

    const menuItems = await this.#repository.list({ name, page });
    return reply.send(menuItems);
  }

  async show(request: FastifyRequest, reply: FastifyReply) {
    const ParamsSchema = z.object({
      id: z.string()
    });

    const { id } = ParamsSchema.parse(request.params);
    const menuItem = await this.#repository.findById(id);

    if (!menuItem) throw new AppError('Menu item not found', 404);
    return reply.send(menuItem);
  }
}
