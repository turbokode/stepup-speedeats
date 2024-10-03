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
}

export class OrderRepository {
  #client = prisma.order;
  async save(data: SaveOrderProps) {
    const { customerId, totalPrice, items } = data;

    const savedOrder = await this.#client.create({
      data: {
        customerId,
        totalPrice,
        deliveryTime: '00:05',
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
}
