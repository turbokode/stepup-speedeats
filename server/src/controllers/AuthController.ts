import { z } from 'zod';
import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { generateToken } from '../utils/auth';
import { EStorageTypes } from '../config/storageTypes';
import { UserRepository } from '../repositories/userRepository';
import { FileRepository } from '../repositories/fileRepository';
import { AppError } from '../errors/AppError';

export default class AuthController {
  #userRepository = new UserRepository();
  #fileRepository = new FileRepository();

  async login(request: FastifyRequest, reply: FastifyReply) {
    const BodySchema = z.object({
      email: z.string().email(),
      password: z.string()
    });
    const { email, password } = BodySchema.parse(request.body);

    const user = await this.#userRepository.findByEmail(email);

    if (!user) throw new AppError('Usuario nao existe', 404);

    if (!user.password) throw new AppError('Autenticacao falhou', 401);

    if (!(await bcrypt.compare(password, user.password))) throw new AppError('Autenticacao falhou', 401);

    const token = generateToken(user);

    return reply.send({
      id: user.id,
      name: user.name,
      email: user.email,
      token
    });
  }

  async googleAuth(request: FastifyRequest, reply: FastifyReply) {
    interface UserProps {
      email: string;
      displayName: string;
      photoURL: string;
    }
    const AuthSchema = z.string();
    const [, idToken] = AuthSchema.parse(request.headers.authorization?.split(' '));

    const credential = GoogleAuthProvider.credential(idToken);
    const auth = getAuth();

    try {
      const sign = await signInWithCredential(auth, credential);
      if (!sign) throw new AppError('Credencial invalida', 401);

      const { email, displayName: name, photoURL } = sign.user as UserProps;

      let user = await this.#userRepository.findByEmail(email);
      if (!user) {
        const photoId = photoURL.split('/').pop() as string;
        const avatar = await this.#fileRepository.save({
          filename: photoId,
          originalname: name,
          storageType: EStorageTypes.GOOGLE
        });
        const savedUser = await this.#userRepository.save({ email, name, avatarId: avatar.id });
        const token = generateToken(savedUser);
        return reply.send({
          ...savedUser,
          token
        });
      }

      const token = generateToken(user);
      return reply.send({
        ...user,
        password: undefined,
        token
      });
    } catch (error) {
      throw new AppError('Autenticacao falhou', 401);
    }
  }
}
