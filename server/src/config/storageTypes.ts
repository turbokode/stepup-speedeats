import { API_PREFIX } from '../utils/constants';
import { BASE_URL } from '../utils/env';

export enum EStorageTypes {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE'
}

interface StorageTypeProps {
  [key: string]: {
    baseUrl: string;
    type: EStorageTypes;
  };
}
export const storageTypes: StorageTypeProps = {
  LOCAL: {
    baseUrl: `${BASE_URL}${API_PREFIX}/public`,
    type: EStorageTypes.LOCAL
  },
  GOOGLE: {
    baseUrl: 'https://lh3.googleusercontent.com/a',
    type: EStorageTypes.GOOGLE
  }
};
