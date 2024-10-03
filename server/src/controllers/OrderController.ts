import { FastifyReply, FastifyRequest } from 'fastify';
import { MenuItemRepository } from '../repositories/menuItemRepository';
import { z } from 'zod';
import { OrderRepository } from '../repositories/orderRepository';

interface MenuItem {
  menuItemId: string;
  quantity: number;
}

export class OrderController {
  #repository = new OrderRepository();
  #menuItemRepository = new MenuItemRepository();

  async create(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      menuItems: z.array(
        z.object({
          menuItemId: z.string(),
          quantity: z.number()
        })
      )
    });
    const customerId = request.userId;
    const { menuItems } = bodySchema.parse(request.body);
    let totalPrice = 0;

    const menuItemsObject: {
      [key: string]: MenuItem;
    } = menuItems.reduce((acc, item) => {
      return {
        ...acc,
        [item.menuItemId]: item
      };
    }, {});

    const menuItemsWithPrices = await this.#menuItemRepository.getByItemsList(menuItems.map((item) => item.menuItemId));

    const parsedMenuItems = menuItemsWithPrices.map((item) => {
      const quantity = menuItemsObject[item.id].quantity;
      totalPrice += quantity * item.price;

      return {
        ...item,
        ...menuItemsObject[item.id]
      };
    });

    const savedOrder = await this.#repository.save({ customerId, totalPrice, items: parsedMenuItems });

    return reply.send(savedOrder);
  }
}
