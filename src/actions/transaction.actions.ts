"use server";

import { revalidatePath } from "next/cache";
import { TransactionService } from "@/services/transaction.service";
import type { CreateTransactionInput } from "@/types";

export async function addTransaction(input: CreateTransactionInput) {
  try {
    const transaction = await TransactionService.create(input);
    revalidatePath("/dashboard/transactions");
    return { success: true, data: transaction };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add transaction";
    return { success: false, error: message };
  }
}
