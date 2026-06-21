import { TransactionRepository } from "@/repositories/transaction.repository";
import { ItemRepository } from "@/repositories/item.repository";
import { transactionSchema } from "@/utils/validators";
import type {
  CreateTransactionInput,
  LiveTransactionSummary,
} from "@/types";

export const TransactionService = {
  async getAll() {
    return TransactionRepository.findAll();
  },

  async getByCustomerId(customerId: string) {
    return TransactionRepository.findByCustomerId(customerId);
  },

  async getUnbilled(customerId: string) {
    return TransactionRepository.findUnbilled(customerId);
  },

  async getLiveSummaries(): Promise<LiveTransactionSummary[]> {
    const transactions = await TransactionRepository.findAllUnbilled();
    const summaries = new Map<string, LiveTransactionSummary>();

    for (const tx of transactions) {
      const existing = summaries.get(tx.customerId);
      const amount = parseFloat(tx.amount);

      if (!existing) {
        summaries.set(tx.customerId, {
          customerId: tx.customerId,
          customerName: tx.customerName ?? "Unknown Customer",
          customerPhone: tx.customerPhone ?? "",
          total: amount.toFixed(2),
          transactionCount: 1,
          itemCount: tx.quantity,
          lastActivityAt: tx.createdAt,
          items: [
            {
              itemName: tx.itemName ?? "Unknown Item",
              quantity: tx.quantity,
              amount: tx.amount,
            },
          ],
        });
        continue;
      }

      existing.total = (parseFloat(existing.total) + amount).toFixed(2);
      existing.transactionCount += 1;
      existing.itemCount += tx.quantity;
      if (tx.createdAt > existing.lastActivityAt) {
        existing.lastActivityAt = tx.createdAt;
      }

      const itemName = tx.itemName ?? "Unknown Item";
      const item = existing.items.find((entry) => entry.itemName === itemName);
      if (item) {
        item.quantity += tx.quantity;
        item.amount = (parseFloat(item.amount) + amount).toFixed(2);
      } else {
        existing.items.push({
          itemName,
          quantity: tx.quantity,
          amount: tx.amount,
        });
      }
    }

    return Array.from(summaries.values()).sort(
      (a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime()
    );
  },

  async create(input: CreateTransactionInput) {
    const validated = transactionSchema.parse(input);

    const item = await ItemRepository.findById(validated.itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    const amount = (parseFloat(item.price) * validated.quantity).toFixed(2);

    return TransactionRepository.create({
      customerId: validated.customerId,
      itemId: validated.itemId,
      quantity: validated.quantity,
      amount,
    });
  },

  async getRecent(limit: number = 10) {
    return TransactionRepository.getRecent(limit);
  },
};
