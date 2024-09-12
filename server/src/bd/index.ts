import { PrismaClient } from '@prisma/client';
import { storageTypes } from '../config/storageTypes';
export const prisma = new PrismaClient().$extends({
  result: {
    file: {
      url: {
        needs: { filename: true, storageType: true },
        compute(file) {
          const url = `${storageTypes[file.storageType].baseUrl}/${file.filename}`;
          return url;
        }
      }
    }
  }
});
