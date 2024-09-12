import { prisma } from '../bd';

interface SaveMenuItemProps {
  name: string;
  description?: string;
  price: number;
  prepareTime: string;
  imageId: string;
  restaurantId: string;
  newIngredients: string[];
  ingredients: string[];
}

interface ListMenuItemsProps {
  name?: string;
  page?: number;
}
export class MenuItemRepository {
  #client = prisma.menuItem;
  async save(data: SaveMenuItemProps) {
    const { name, description, price, prepareTime, imageId, restaurantId, newIngredients, ingredients } = data;
    const savedMenuItem = await this.#client.create({
      data: {
        name,
        description,
        price,
        prepareTime,
        imageId,
        restaurantId,
        ingredients: {
          create: [
            ...ingredients.map((id) => {
              return {
                ingredient: {
                  connect: {
                    id
                  }
                }
              };
            }),
            ...newIngredients.map((name) => {
              return {
                ingredient: {
                  create: {
                    name
                  }
                }
              };
            })
          ]
        }
      }
    });
    return savedMenuItem;
  }

  async list({ name, page = 0 }: ListMenuItemsProps) {
    const menuItems = await this.#client.findMany({
      where: {
        name: {
          contains: name
        }
      },
      include: {
        image: true,
        restaurant: true
      },
      skip: page * 5,
      take: 5
    });
    return menuItems;
  }

  async findById(id: string) {
    const menuItem = await this.#client.findFirst({
      where: {
        id
      },
      include: {
        image: true,
        restaurant: true,
        ingredients: {
          include: {
            ingredient: true
          }
        }
      }
    });
    return menuItem;
  }
}
