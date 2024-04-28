import { randomUUID } from 'crypto';
import fs from 'fs';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';

export function upload(field: string) {
  return (request: FastifyRequest, reply: FastifyReply, done: (err?: FastifyError) => void) => {
    const file = request.body[field];

    const fileName = `${randomUUID()}-${file.filename}`.replace(/ /g, '_');
    const filePath = path.resolve(__dirname, '..', '..', 'uploads', fileName);

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
    // const savedFile = await filesRepository.save({
    //   filename: fileName,
    //   originalName: file.filename
    // });
  };
}
