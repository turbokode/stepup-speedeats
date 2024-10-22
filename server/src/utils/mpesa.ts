import { client } from '../config/mpesa';
import { AppError } from '../errors/AppError';
import { generateRandomNumber } from './utils';

interface PaymentResponse {
  status: number;
  code: string;
  description: string;
  reference: string;
  success: boolean;
}
export async function receivePayment(from: string, amount: number): Promise<PaymentResponse> {
  const reference = generateRandomNumber(5);
  const paymentData = {
    from, //
    reference,
    transaction: `T${generateRandomNumber(5)}CC`,
    amount
  };

  try {
    const response = await client.receive(paymentData);

    const parsedResponse = {
      status: response.response.status,
      code: response.response.code,
      description: response.response.desc,
      reference: response.reference,
      success: true
    };
    return parsedResponse;
  } catch (error) {
    const response = {
      status: error.response.status,
      code: '',
      description: error.response.statusText,
      reference: '',
      success: false
    };
    return response;
  }
}

export async function sendPayment(to: string, amount: number): Promise<PaymentResponse> {
  const reference = generateRandomNumber(5);

  const paymentData = {
    to,
    reference,
    transaction: `T${generateRandomNumber(5)}CC`,
    amount
  };

  try {
    const response = await client.send(paymentData);

    const parsedResponse = {
      status: response.response.status,
      code: response.response.code,
      description: response.response.desc,
      reference: response.reference,
      success: true
    };
    return parsedResponse;
  } catch (error) {
    const response = {
      status: error.response.status,
      code: '',
      description: error.response.statusText,
      reference: '',
      success: false
    };
    return response;
  }
}
