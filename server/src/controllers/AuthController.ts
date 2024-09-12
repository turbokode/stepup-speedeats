import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { UserRepository } from '../repositories/userRepository';
import { generateToken } from '../services/authService';
import { FileRepository } from '../repositories/fileRepository';
import { EStorageType } from '../config/storageTypes';
import { z } from 'zod';
import { AppError } from '../errors/AppError';

interface SignUserProps {
  displayName: string;
  email: string;
  photoURL: string;
}
export class AuthController {
  userRepository = new UserRepository();
  fileRepository = new FileRepository();

  async login(request: FastifyRequest, reply: FastifyReply) {
    const BodySchema = z.object({
      email: z.string().email(),
      password: z.string()
    });
    const { email, password } = BodySchema.parse(request.body);
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Usuário nao encontrado', 404);
    }
    if (!user.password) throw new AppError('A autenticacao falhou', 401);
    if (!(await bcrypt.compare(password, user.password))) {
      throw new AppError('A autenticacao falhou', 401);
    }

    const token = generateToken(user);
    return reply.send({ ...user, password: undefined, token });
  }

  async loginGoogle(request: FastifyRequest, reply: FastifyReply) {
    const [, id_token] = z.string().parse(request.headers.authorization?.split(' '));

    const credential = GoogleAuthProvider.credential(id_token);

    const auth = getAuth();
    try {
      const sign = await signInWithCredential(auth, credential);
      const { email, displayName: name, photoURL } = sign.user as SignUserProps;

      let user = await this.userRepository.findByEmail(email);

      if (!user) {
        const photoId = photoURL.split('/').pop() as string;
        const avatar = await this.fileRepository.save({
          filename: photoId,
          originalname: name,
          storageType: EStorageType.GOOGLE
        });
        const user = await this.userRepository.save({ name, email, avatarId: avatar.id });
        const token = generateToken({ ...user, restaurant: undefined });
        return reply.send({ ...user, password: undefined, token });
      } else {
        const token = generateToken(user);
        return reply.send({ ...user, password: undefined, token });
      }
    } catch (error) {
      throw new AppError('A autenticacao falhou', 401);
    }
  }
}
