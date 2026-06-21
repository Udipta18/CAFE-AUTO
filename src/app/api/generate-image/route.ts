import { NextRequest } from "next/server";
import { ImageService } from "@/services/image.service";
import { invoiceIdSchema } from "@/utils/validators";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId } = invoiceIdSchema.parse(body);

    const imageUrl = await ImageService.generateInvoiceImage(invoiceId);

    return Response.json({ success: true, imageUrl });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate invoice image";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
