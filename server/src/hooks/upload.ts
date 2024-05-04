import { randomUUID } from 'crypto';
import fs from 'fs';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';
import { UPLOADS_DIR } from '../utils/constants';

export function upload(field: string) {
  return (request: FastifyRequest, reply: FastifyReply, done: (err?: FastifyError) => void) => {
    const file = request.body[field];
    console.log(UPLOADS_DIR);

    const fileName = `${randomUUID()}-${file.filename}`.replace(/ /g, '_');
    const filePath = path.join(UPLOADS_DIR, fileName);

    fs.promises
      .writeFile(filePath, file._buf)
      .then((res) => {
        const savedFile = {
          filename: fileName,
          originalname: file.filename
        };

        const body = Object.fromEntries(Object.keys(request.body).map((key) => [key, request.body[key].value]));

        body[field] = savedFile;
        request.body = body;

        done();
      })
      .catch((error) => {
        return reply.status(400).send(error);
      });
  };
}
