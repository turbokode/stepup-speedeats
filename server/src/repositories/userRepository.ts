import { prisma } from '../db';
import bcrypt from 'bcrypt';

interface UpdateUserProps {
  email?: string;
  name?: string;
  password?: string;
  phone?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  avatarId?: string;
}

export class UserRepository {
  #client = prisma.user;

  async save(user: { name: string; email: string; password?: string; avatarId?: string }) {
    const { name, email, password, avatarId } = user;
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;
    const savedUser = await this.#client.create({
      data: {
        name,
        email,
        password: passwordHash,
        avatarId: avatarId
      },
      include: { avatar: true }
    });

    return { ...savedUser, password: undefined };
  }

  async findByEmail(email: string) {
    const user = await this.#client.findFirst({
      where: {
        email
      },
      include: { avatar: true }
    });
    return user;
  }

  async findById(id: string) {
    const user = await this.#client.findFirst({
      where: {
        id
      }
    });
    return user;
  }

  async update(id: string, user: UpdateUserProps) {
    const passwordHash = user.password ? await bcrypt.hash(user.password, 10) : undefined;
    const updatedUser = await this.#client.update({
      data: { ...user, password: passwordHash },
      where: { id },
      include: { avatar: true }
    });

    return { ...updatedUser, password: undefined };
  }
}
