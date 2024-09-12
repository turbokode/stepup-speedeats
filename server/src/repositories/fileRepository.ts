import { prisma } from '../bd';
import { EStorageType } from '../config/storageTypes';

interface SaveFileProps {
  filename: string;
  originalname: string;
  storageType?: EStorageType;
}

export class FileRepository {
  #client = prisma.file;

  save({ filename, originalname, storageType }: SaveFileProps) {
    const savedFile = this.#client.create({
      data: {
        filename,
        originalname,
        storageType
      }
    });
    return savedFile;
  }
}
