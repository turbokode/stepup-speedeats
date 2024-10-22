import { prisma } from '../bd';

export enum PaymentStatus {
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS'
}

export enum PaymentTypes {
  INCOME = 'INCOME',
  OUTCOME = 'OUTCOME'
}

interface SavePaymentProps {
  amount: number;
  status?: PaymentStatus;
  type?: PaymentTypes;
  code: string;
  description: string;
  reference: string;
  mpesa: string;
  customerId?: string;
  restaurantId?: string;
}

export class PaymentRepository {
  #client = prisma.payment;

  async save(data: SavePaymentProps) {
    const { amount, code, description, mpesa, reference, status, type, customerId, restaurantId } = data;
    const savedPayment = await this.#client.create({
      data: {
        amount,
        code,
        description,
        mpesa,
        reference,
        status,
        type,
        customerId,
        restaurantId
      }
    });
    return savedPayment;
  }
}
