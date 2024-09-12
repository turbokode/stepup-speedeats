import { prisma } from '../bd';
import bcrypt from 'bcrypt';

interface saveUserProps {
  name: string;
  email: string;
  password?: string;
  avatarId?: string;
}
interface UpdateUserProps {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  password?: string;
  avatarId?: string;
}

export class UserRepository {
  client = prisma.user;

  async save(user: saveUserProps) {
    const { name, email, password, avatarId } = user;
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;
    const savedUser = await this.client.create({
      data: {
        name,
        email,
        password: passwordHash,
        avatarId
      }
    });
    // Storing user data in the Map
    return savedUser;
  }

  async findByEmail(email: string) {
    const user = await this.client.findUnique({
      where: {
        email
      },
      include: {
        restaurant: true
      }
    });
    return user;
  }

  async update(id: string, { email, address, latitude, longitude, name, phone, password, avatarId }: UpdateUserProps) {
    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
    const updateUser = await this.client.update({
      data: {
        email,
        address,
        latitude,
        longitude,
        name,
        phone,
        avatarId,
        password: passwordHash
      },
      where: {
        id
      }
    });
    return { ...updateUser, password: undefined };
  }
}
