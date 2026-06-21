import { NextRequest } from "next/server";
import { InvoiceService } from "@/services/invoice.service";
import { tokenSchema } from "@/utils/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = tokenSchema.parse(body);

    await InvoiceService.dispute(token);

    return Response.json({ success: true, message: "Invoice disputed" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to dispute invoice";
    return Response.json({ success: false, error: message }, { status: 400 });
  }
}
