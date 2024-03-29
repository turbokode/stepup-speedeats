import { FastifyReply, FastifyRequest } from 'fastify';

import { randomUUID } from 'crypto';

export class MenuItemsController {
  menuItems = new Map();

  create(request: FastifyRequest, reply: FastifyReply) {
    const { name, price, description, deliveryTime } = request.body;

    const id = randomUUID();
    this.menuItems.set(id, { name, price, description, deliveryTime });

    return reply.status(201).send();
  }

  list(request: FastifyRequest, reply: FastifyReply) {
    const { name } = request.query;

    let menuItemsArr = Array.from(this.menuItems).map((item) => {
      return {
        id: item[0],
        ...item[1]
      };
    });

    if (name) {
      menuItemsArr = menuItemsArr.filter((item) => {
        return item.name.includes(name);
      });
    }

    return reply.send(menuItemsArr);
  }
}
