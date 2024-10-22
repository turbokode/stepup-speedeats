import { prisma } from '../bd';

interface Item {
  menuItemId: string;
  restaurantId: string;
  quantity: number;
}

interface SaveOrderProps {
  items: Item[];
  totalPrice: number;
  customerId: string;
  deliveryTime: string;
}

interface UpdateOrderProps {
  deliveredAt?: Date;
  canceledAt?: Date;
  paymentId?: string;
}

interface ListOrdersProps {
  restaurantId?: string;
  customerId?: string;
}

export class OrderRepository {
  #client = prisma.order;
  #orderItemClient = prisma.orderItem;
  async save(data: SaveOrderProps) {
    const { customerId, totalPrice, items, deliveryTime } = data;

    const savedOrder = await this.#client.create({
      data: {
        customerId,
        totalPrice,
        deliveryTime,
        orderItems: {
          create: items.map((item) => {
            return {
              menuItemId: item.menuItemId,
              restaurantId: item.restaurantId,
              quantity: item.quantity
            };
          })
        }
      }
    });
    return savedOrder;
  }

  async findById(id: string, options?: { restaurantId?: string }) {
    const restaurantId = options?.restaurantId;

    const order = await this.#client.findFirst({
      where: {
        id,
        orderItems: {
          some: {
            restaurantId
          }
        }
      },
      include: {
        orderItems: {
          where: {
            restaurantId
          },
          include: {
            menuItem: true,
            restaurant: true
          }
        }
      }
    });
    return order;
  }

  async update(id: string, data: UpdateOrderProps) {
    const { deliveredAt, canceledAt, paymentId } = data;
    const updatedOrder = await this.#client.update({
      where: {
        id
      },
      data: {
        deliveredAt,
        canceledAt,
        paymentId
      }
    });

    return updatedOrder;
  }

  async list({ restaurantId, customerId }: ListOrdersProps) {
    const orders = await this.#client.findMany({
      include: {
        orderItems: {
          where: {
            restaurantId
          },
          include: {
            menuItem: true
          }
        }
      },
      where: {
        orderItems: {
          some: {
            restaurantId
          }
        },
        customerId,
        canceledAt: null,
        deliveredAt: null
      }
    });
    return orders;
  }

  async updateOrderItemPayment(data: { menuItemId: string; orderId: string; transferId: string }) {
    const { menuItemId, orderId, transferId } = data;
    const updatedItem = await this.#orderItemClient.update({
      where: {
        orderId_menuItemId: {
          menuItemId,
          orderId
        }
      },
      data: {
        transferId
      }
    });

    return updatedItem;
  }
}
