import { FastifyReply, FastifyRequest } from 'fastify';
import { MenuItemRepository } from '../repositories/menuItemRepository';
import { z } from 'zod';
import { OrderRepository } from '../repositories/orderRepository';
import { UserRepository } from '../repositories/userRepository';
import { calculateTimeBetweenCoordinates } from '../utils/maps';
import { AppError } from '../errors/AppError';
import { getMaxNumber } from '../utils/utils';
import { convertSecondsToTime, convertTimeToSeconds } from '../utils/time';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { receivePayment, sendPayment } from '../utils/mpesa';
import { PaymentRepository, PaymentStatus, PaymentTypes } from '../repositories/paymentRepository';

dayjs.extend(duration);

interface MenuItem {
  menuItemId: string;
  quantity: number;
}

export class OrderController {
  #repository = new OrderRepository();
  #menuItemRepository = new MenuItemRepository();
  #userRepository = new UserRepository();
  #paymentRepository = new PaymentRepository();

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

    const user = await this.#userRepository.findById(customerId);
    if (!user?.latitude || !user?.longitude) {
      throw new AppError('User coordinates not set');
    }

    const menuItemsWithPrices = await this.#menuItemRepository.getByItemsList(menuItems.map((item) => item.menuItemId));

    const parsedMenuItems = menuItemsWithPrices.map((item) => {
      const quantity = menuItemsObject[item.id].quantity;
      totalPrice += quantity * item.price;

      return {
        ...item,
        ...menuItemsObject[item.id]
      };
    });

    const itemPreparationsInSeconds = parsedMenuItems.map((item) => convertTimeToSeconds(item.prepareTime));

    const maxPreparationTime = getMaxNumber(itemPreparationsInSeconds);

    const times = await calculateTimeBetweenCoordinates(
      menuItemsWithPrices.map((item) => ({
        latitude: Number(item.restaurant.latitude),
        longitude: Number(item.restaurant.longitude)
      })),
      {
        latitude: Number(user.latitude),
        longitude: Number(user.longitude)
      }
    );

    const maxDeliveryTime = getMaxNumber(times);

    const totalDeliveryTimeInSeconds = maxPreparationTime + maxDeliveryTime;

    const deliveryTime = convertSecondsToTime(totalDeliveryTimeInSeconds);

    const savedOrder = await this.#repository.save({ customerId, totalPrice, items: parsedMenuItems, deliveryTime });

    return reply.send(savedOrder);
  }

  async setOrderAsDelivered(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string()
    });
    const { userId } = request;
    const { id } = paramsSchema.parse(request.params);

    const order = await this.#repository.findById(id);
    console.log(order);

    if (!order) throw new AppError('Order not found', 404);

    if (order.customerId !== userId) throw new AppError('The user has no permission to update order', 403);

    if (order.deliveredAt || order.canceledAt) throw new AppError('Order status has already been updated', 403);
    if (!order.paymentId) throw new AppError('Order has not been paid', 403);

    order.orderItems.forEach(async (item) => {
      const mpesa = item.restaurant.mpesa;
      const amount = item.quantity * item.menuItem.price;
      const transfer = await sendPayment(mpesa, amount);

      const savedTransfer = await this.#paymentRepository.save({
        amount,
        code: transfer.code,
        description: transfer.description,
        mpesa,
        reference: transfer.reference,
        status: PaymentStatus.SUCCESS,
        restaurantId: item.restaurantId,
        type: PaymentTypes.OUTCOME
      });

      await this.#repository.updateOrderItemPayment({
        menuItemId: item.menuItemId,
        orderId: item.orderId,
        transferId: savedTransfer.id
      });
    });

    const updatedOrder = await this.#repository.update(id, { deliveredAt: new Date() });

    return reply.send(updatedOrder);
  }

  async cancelOrder(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string()
    });
    const { userId } = request;
    const { id } = paramsSchema.parse(request.params);

    const order = await this.#repository.findById(id);

    if (!order) throw new AppError('Order not found', 404);

    if (order.customerId !== userId) throw new AppError('The user has no permission to update order', 403);

    if (order.deliveredAt || order.canceledAt) throw new AppError('Order status has already been updated', 403);

    const expectedDeliveryTime = dayjs(order.createdAt).add(
      dayjs.duration({
        hours: Number(order.deliveryTime.split(':')[0]),
        minutes: Number(order.deliveryTime.split(':')[1])
      })
    );

    const deliveryCancelRange = expectedDeliveryTime.subtract(dayjs.duration({ minutes: 15 }));

    if (dayjs().isAfter(deliveryCancelRange)) throw new AppError('Delivery cannot be canceled at this time', 403);

    await this.#repository.update(id, { canceledAt: new Date() });

    return reply.status(204).send();
  }

  async listRestaurantOrders(request: FastifyRequest, reply: FastifyReply) {
    const restaurantId = request.restaurantId;
    if (!restaurantId) throw new AppError('User has no access to restaurant orders', 401);

    const orders = await this.#repository.list({ restaurantId });
    return reply.send(orders);
  }
  async listCustomerOrders(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request;

    const orders = await this.#repository.list({ customerId: userId });
    return reply.send(orders);
  }

  async show(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string()
    });
    const { userId, restaurantId } = request;
    const { id } = paramsSchema.parse(request.params);

    const order = await this.#repository.findById(id, { restaurantId: restaurantId ? restaurantId : undefined });

    if (!order) throw new AppError('Order not found', 404);

    if (order.customerId !== userId && !restaurantId)
      throw new AppError('The user has no permission to view order', 403);

    return reply.send(order);
  }

  async makePayment(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      mpesa: z.string()
    });
    const paramsSchema = z.object({
      id: z.string()
    });

    const { mpesa } = bodySchema.parse(request.body);
    const { id } = paramsSchema.parse(request.params);
    const { userId } = request;

    const order = await this.#repository.findById(id);

    if (!order) throw new AppError('Order not found', 404);

    if (order.customerId !== userId) throw new AppError('The user has no permission to view order', 403);
    if (order.paymentId) throw new AppError('This order has already been paid');

    const payment = await receivePayment(mpesa, order.totalPrice);

    if (!payment.success) throw new AppError(payment.description, payment.status);

    const savedPayment = await this.#paymentRepository.save({
      amount: order.totalPrice,
      code: payment.code,
      description: payment.description,
      mpesa,
      reference: payment.reference,
      status: PaymentStatus.SUCCESS,
      customerId: userId
    });

    await this.#repository.update(id, { paymentId: savedPayment.id });

    return reply.send(savedPayment);
  }
}
