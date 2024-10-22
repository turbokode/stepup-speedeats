import { Client } from '@paymentsds/mpesa';
import { MPESA_API_KEY, MPESA_PUBLIC_KEY, MPESA_SERVICE_PROVIDER_CODE } from '../utils/env';

export const client = new Client({
  apiKey: MPESA_API_KEY,
  publicKey: MPESA_PUBLIC_KEY,
  serviceProviderCode: MPESA_SERVICE_PROVIDER_CODE
});
