import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { UserRepository } from '../repositories/userRepository';
import { generateToken } from '../utils/auth';

export default class AuthController {
  #userRepository = new UserRepository();
  async login(request: FastifyRequest, reply: FastifyReply) {
    interface RequestBodyProps {
      email: string;
      password: string;
    }
    const { email, password } = request.body as RequestBodyProps;

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
    const [, idToken] = request.headers.authorization?.split(' ');
    const credential = GoogleAuthProvider.credential(idToken);
    const auth = getAuth();

    try {
      const sign = await signInWithCredential(auth, credential);
      const { email, displayName: name, photoURL } = sign.user as UserProps;
      let user = await this.#userRepository.findByEmail(email);

      if (!user) {
        user = await this.#userRepository.save({ email, name });
      }

      const token = generateToken(user);
      return reply.send({
        id: user.id,
        name: user.name,
        email: user.email,
        token
      });
    } catch (error) {
      return reply.send(error);
    }
  }
}
