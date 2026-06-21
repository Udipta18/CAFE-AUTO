import { InvoiceRepository } from "@/repositories/invoice.repository";
import { TransactionRepository } from "@/repositories/transaction.repository";
import type { InvoiceStatus } from "@/types";
import crypto from "crypto";

export const InvoiceService = {
  async getAll() {
    return InvoiceRepository.findAll();
  },

  async getByStatus(status: InvoiceStatus) {
    return InvoiceRepository.findByStatus(status);
  },

  async getByToken(token: string) {
    const invoice = await InvoiceRepository.findByToken(token);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    const items = await InvoiceRepository.getItemsByInvoiceId(invoice.id);
    return { ...invoice, items };
  },

  async getById(id: string) {
    const invoice = await InvoiceRepository.findById(id);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    const items = await InvoiceRepository.getItemsByInvoiceId(invoice.id);
    return { ...invoice, items };
  },

  async generateInvoice(customerId: string) {
    const unbilledTransactions =
      await TransactionRepository.findUnbilled(customerId);

    if (unbilledTransactions.length === 0) {
      throw new Error("No unbilled transactions found for this customer");
    }

    // Aggregate by item
    const aggregated = new Map<
      string,
      { itemName: string; quantity: number; amount: number }
    >();

    for (const tx of unbilledTransactions) {
      const key = tx.itemName ?? "Unknown Item";
      const existing = aggregated.get(key);
      if (existing) {
        existing.quantity += tx.quantity;
        existing.amount += parseFloat(tx.amount);
      } else {
        aggregated.set(key, {
          itemName: key,
          quantity: tx.quantity,
          amount: parseFloat(tx.amount),
        });
      }
    }

    const total = Array.from(aggregated.values())
      .reduce((sum, item) => sum + item.amount, 0)
      .toFixed(2);

    const token = crypto.randomUUID();

    // Create invoice
    const invoice = await InvoiceRepository.create({
      token,
      customerId,
      total,
      status: "PENDING",
    });

    // Create invoice items
    const invoiceItemsData = Array.from(aggregated.values()).map((item) => ({
      invoiceId: invoice.id,
      itemName: item.itemName,
      quantity: item.quantity,
      amount: item.amount.toFixed(2),
    }));

    await InvoiceRepository.createItems(invoiceItemsData);

    // Link transactions to this invoice
    const transactionIds = unbilledTransactions.map((tx) => tx.id);
    await TransactionRepository.bulkUpdateInvoiceId(
      transactionIds,
      invoice.id
    );

    return invoice;
  },

  async generatePaidInvoice(customerId: string) {
    const invoice = await InvoiceService.generateInvoice(customerId);
    return InvoiceRepository.updateStatus(invoice.id, "PAID", {
      approvedAt: new Date(),
      paidAt: new Date(),
    });
  },

  async approve(token: string) {
    const invoice = await InvoiceRepository.findByToken(token);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    if (invoice.status !== "PENDING") {
      throw new Error("Invoice is not in pending status");
    }
    return InvoiceRepository.updateStatus(invoice.id, "APPROVED", {
      approvedAt: new Date(),
    });
  },

  async dispute(token: string) {
    const invoice = await InvoiceRepository.findByToken(token);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    if (invoice.status !== "PENDING") {
      throw new Error("Invoice is not in pending status");
    }
    return InvoiceRepository.updateStatus(invoice.id, "DISPUTED");
  },

  async markPaid(invoiceId: string) {
    const invoice = await InvoiceRepository.findById(invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    if (invoice.status !== "APPROVED") {
      throw new Error("Invoice must be approved before marking as paid");
    }
    return InvoiceRepository.updateStatus(invoiceId, "PAID", {
      paidAt: new Date(),
    });
  },

  async search(query: string) {
    if (!query.trim()) {
      return InvoiceRepository.findAll();
    }
    return InvoiceRepository.search(query);
  },
};
