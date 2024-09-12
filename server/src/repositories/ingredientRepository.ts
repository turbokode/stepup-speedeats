import { prisma } from '../bd';

export class IngredientRepository {
  #client = prisma.ingredient;

  async list(name?: string) {
    const ingredients = this.#client.findMany({
      where: {
        name: {
          contains: name
        }
      },
      take: 5
    });

    return ingredients;
  }
}
