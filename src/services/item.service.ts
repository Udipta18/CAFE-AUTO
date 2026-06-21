import { ItemRepository } from "@/repositories/item.repository";
import { itemSchema } from "@/utils/validators";
import type { CreateItemInput, UpdateItemInput } from "@/types";

export const ItemService = {
  async getAll() {
    return ItemRepository.findAll();
  },

  async getActive() {
    return ItemRepository.findActive();
  },

  async getById(id: string) {
    const item = await ItemRepository.findById(id);
    if (!item) {
      throw new Error("Item not found");
    }
    return item;
  },

  async create(input: CreateItemInput) {
    const validated = itemSchema.parse(input);
    return ItemRepository.create(validated);
  },

  async update(input: UpdateItemInput) {
    const validated = itemSchema.parse({
      name: input.name,
      price: input.price,
    });
    return ItemRepository.update({
      id: input.id,
      ...validated,
      active: input.active,
    });
  },

  async remove(id: string) {
    await ItemRepository.remove(id);
  },
};
