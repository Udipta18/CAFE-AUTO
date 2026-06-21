import { NextRequest } from "next/server";
import { InvoiceService } from "@/services/invoice.service";
import { invoiceIdSchema } from "@/utils/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId } = invoiceIdSchema.parse(body);

    await InvoiceService.markPaid(invoiceId);

    return Response.json({ success: true, message: "Invoice marked as paid" });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to mark invoice as paid";
    return Response.json({ success: false, error: message }, { status: 400 });
  }
}
