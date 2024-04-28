import { prisma } from '../db';

interface SaveFileProps {
  filename: string;
  originalname: string;
}

export class FileRepository {
  #client = prisma.file;

  async save({ filename, originalname }: SaveFileProps) {
    console.log('saving');
    const savedFile = await this.#client.create({
      data: {
        filename,
        originalname
      }
    });
    console.log('return');

    return savedFile;
  }
}
