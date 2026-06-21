"use server";

import { revalidatePath } from "next/cache";
import { ItemService } from "@/services/item.service";
import type { CreateItemInput, UpdateItemInput } from "@/types";

export async function createItem(input: CreateItemInput) {
  try {
    const item = await ItemService.create(input);
    revalidatePath("/dashboard/items");
    return { success: true, data: item };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create item";
    return { success: false, error: message };
  }
}

export async function updateItem(input: UpdateItemInput) {
  try {
    const item = await ItemService.update(input);
    revalidatePath("/dashboard/items");
    return { success: true, data: item };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update item";
    return { success: false, error: message };
  }
}

export async function deleteItem(id: string) {
  try {
    await ItemService.remove(id);
    revalidatePath("/dashboard/items");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete item";
    return { success: false, error: message };
  }
}
