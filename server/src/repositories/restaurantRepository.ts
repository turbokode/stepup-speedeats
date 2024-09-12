import { prisma } from '../bd';

interface SaveRestaurantProps {
  name: string;
  phone: string;
  slogan: string;
  closeTime: string;
  email: string;
  imageId: string;
  latitude: number;
  longitude: number;
  openTime: string;
  address?: string;
  description?: string;
  createdBy: string;
}
interface UpdateRestaurantProps {
  name?: string;
  phone?: string;
  slogan?: string;
  closeTime?: string;
  email?: string;
  imageId?: string;
  latitude?: number;
  longitude?: number;
  openTime?: string;
  address?: string;
  description?: string;
}

interface ListRestaurantProps {
  name?: string;
  page?: number;
}

export class RestaurantRepository {
  #client = prisma.restaurant;

  save(data: SaveRestaurantProps) {
    const savedRestaurant = this.#client.create({
      data
    });
    return savedRestaurant;
  }

  async list({ name, page = 0 }: ListRestaurantProps) {
    const restaurants = await this.#client.findMany({
      where: {
        name: {
          contains: name
        }
      },
      include: {
        image: true
      },
      skip: page * 5,
      take: 5
    });
    return restaurants;
  }

  async findById(id: string) {
    const restaurant = await this.#client.findFirst({
      where: { id },
      include: {
        image: true,
        menuItems: true
      }
    });
    return restaurant;
  }

  async findByEmail(email: string) {
    const restaurant = await this.#client.findUnique({
      where: {
        email
      }
    });
    return restaurant;
  }

  async update(id: string, data: UpdateRestaurantProps) {
    const updatedRestaurant = await this.#client.update({
      data,
      where: {
        id
      }
    });
    return updatedRestaurant;
  }
}
