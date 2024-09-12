import { randomUUID } from 'crypto';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';
import fs from 'fs';
import { UPLOADS_DIR } from '../utils/constants';
import { AppError } from '../errors/AppError';

interface FileProps {
  [key: string]: {
    filename: string;
    _buf: string;
    value: unknown | string;
  };
}

export function uploadHook(field: string) {
  return (request: FastifyRequest, reply: FastifyReply, done: (error?: FastifyError) => void) => {
    const requestBody = request.body as FileProps;
    const file = requestBody[field];
    const body = Object.fromEntries(
      Object.keys(requestBody).map((key) => {
        let parsedKey = key;
        let value = requestBody[key].value;
        if (key.endsWith('[]')) {
          parsedKey = key.split('[]')[0];
          value = String(value) === '' ? [] : String(value).split(',');
        }
        return [parsedKey, value];
      })
    );

    if (file) {
      const fileName = `${randomUUID()}-${file.filename}`.replace(/ /g, '_');
      const filePath = path.join(UPLOADS_DIR, fileName);

      fs.promises
        .writeFile(filePath, file._buf)
        .then(() => {
          body[field] = {
            filename: fileName,
            originalname: file.filename
          };
          request.body = body;
          done();
        })
        .catch((error) => {
          throw new AppError('Erro no upload');
        });
    } else {
      request.body = body;
      done();
    }
  };
}
