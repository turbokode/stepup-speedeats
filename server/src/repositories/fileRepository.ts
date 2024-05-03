import { EStorageTypes } from '../config/storageTypes';
import { prisma } from '../db';

interface SaveFileProps {
  filename: string;
  originalname: string;
  storageType?: EStorageTypes;
}

export class FileRepository {
  #client = prisma.file;

  async save({ filename, originalname, storageType }: SaveFileProps) {
    const savedFile = await this.#client.create({
      data: {
        filename,
        originalname,
        storageType
      }
    });
    return savedFile;
  }
}
