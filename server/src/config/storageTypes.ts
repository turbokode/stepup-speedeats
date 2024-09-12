import { API_PREFIX } from '../utils/constants';
import { BASE_URL, PORT } from '../utils/env';

export enum EStorageType {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE'
}

interface IStorageType {
  [key: string]: {
    baseUrl: string;
    type: EStorageType;
  };
}

export const storageTypes: IStorageType = {
  LOCAL: {
    baseUrl: `${BASE_URL}:${PORT}${API_PREFIX}/public`,
    type: EStorageType.LOCAL
  },
  GOOGLE: {
    baseUrl: 'https://lh3.googleusercontent.com/a',
    type: EStorageType.GOOGLE
  }
};
