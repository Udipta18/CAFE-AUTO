"use server";

import { revalidatePath } from "next/cache";
import { InvoiceService } from "@/services/invoice.service";

export async function generateInvoice(customerId: string) {
  try {
    const invoice = await InvoiceService.generateInvoice(customerId);
    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard/transactions");
    return { success: true, data: invoice };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate invoice";
    return { success: false, error: message };
  }
}

export async function generatePaidInvoice(customerId: string) {
  try {
    const invoice = await InvoiceService.generatePaidInvoice(customerId);
    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard/transactions");
    return { success: true, data: invoice };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate paid invoice";
    return { success: false, error: message };
  }
}

export async function markInvoicePaid(invoiceId: string) {
  try {
    const invoice = await InvoiceService.markPaid(invoiceId);
    revalidatePath("/dashboard/invoices");
    return { success: true, data: invoice };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to mark invoice as paid";
    return { success: false, error: message };
  }
}
