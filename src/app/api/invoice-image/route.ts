import { NextRequest } from "next/server";
import { ImageService } from "@/services/image.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response("Missing id parameter", { status: 400 });
    }

    const svg = await ImageService.generateInvoiceSvg(id);

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load receipt image";
    return new Response(message, { status: 500 });
  }
}
