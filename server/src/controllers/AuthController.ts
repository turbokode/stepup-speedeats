import { z } from 'zod';
import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { generateToken } from '../utils/auth';
import { EStorageTypes } from '../config/storageTypes';
import { UserRepository } from '../repositories/userRepository';
import { FileRepository } from '../repositories/fileRepository';

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

    if (!user) {
      return reply.status(404).send({ error: 'Usuario nao existe' });
    }

    if (!user.password) {
      return reply.status(401).send({ error: 'Autenticacao falhou' });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return reply.status(401).send({ error: 'Autenticacao falhou' });
    }

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
      if (!sign) return reply.status(401).send({ error: 'Invalid credential' });

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
      return reply.send(error);
    }
  }
}
