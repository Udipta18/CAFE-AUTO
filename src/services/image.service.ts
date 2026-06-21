import { InvoiceService } from "@/services/invoice.service";
import { CURRENCY_SYMBOL } from "@/constants";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatMoney(value: string) {
  return `${CURRENCY_SYMBOL}${parseFloat(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export const ImageService = {
  async generateInvoiceSvg(invoiceId: string): Promise<string> {
    const invoice = await InvoiceService.getById(invoiceId);
    const customerName = escapeXml(invoice.customerName ?? "Customer");
    const date = invoice.createdAt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const itemRows = invoice.items
      .slice(0, 10)
      .map((item, index) => {
        const y = 292 + index * 42;
        return `
          <text x="48" y="${y}" class="item">${escapeXml(item.itemName)}</text>
          <text x="330" y="${y}" class="item" text-anchor="middle">x${item.quantity}</text>
          <text x="552" y="${y}" class="item strong" text-anchor="end">${formatMoney(item.amount)}</text>
          <line x1="42" y1="${y + 18}" x2="558" y2="${y + 18}" stroke="#eadcae" stroke-width="1" />
        `;
      })
      .join("");

    const moreItems =
      invoice.items.length > 10
        ? `<text x="48" y="720" class="muted">+${invoice.items.length - 10} more item(s)</text>`
        : "";

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="820" viewBox="0 0 600 820">
  <defs>
    <style>
      .brand { font: 900 46px Arial, sans-serif; fill: #050505; }
      .label { font: 700 14px Arial, sans-serif; fill: #5f5537; text-transform: uppercase; }
      .text { font: 500 20px Arial, sans-serif; fill: #101010; }
      .item { font: 500 18px Arial, sans-serif; fill: #101010; }
      .strong { font-weight: 800; }
      .muted { font: 500 15px Arial, sans-serif; fill: #766b4a; }
    </style>
  </defs>
  <rect width="600" height="820" rx="28" fill="#fffaf0"/>
  <rect width="600" height="160" rx="28" fill="#ffc400"/>
  <rect y="132" width="600" height="28" fill="#ffc400"/>
  <circle cx="78" cy="78" r="42" fill="#050505"/>
  <text x="78" y="92" text-anchor="middle" font-family="Arial, sans-serif" font-size="38" font-weight="900" fill="#ffc400">CS</text>
  <text x="140" y="74" class="brand">CLICK SIP</text>
  <text x="142" y="106" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#2c2718">PAID RECEIPT</text>

  <rect x="36" y="190" width="528" height="92" rx="16" fill="#ffffff" stroke="#eadcae"/>
  <text x="58" y="225" class="label">Customer</text>
  <text x="58" y="255" class="text strong">${customerName}</text>
  <text x="430" y="225" class="label">Date</text>
  <text x="430" y="255" class="text">${escapeXml(date)}</text>

  <text x="42" y="326" class="label">Item</text>
  <text x="330" y="326" class="label" text-anchor="middle">Qty</text>
  <text x="558" y="326" class="label" text-anchor="end">Amount</text>
  <line x1="36" y1="342" x2="564" y2="342" stroke="#050505" stroke-width="2"/>
  <g transform="translate(0, 70)">
    ${itemRows}
    ${moreItems}
  </g>

  <rect x="36" y="690" width="528" height="86" rx="18" fill="#ffc400"/>
  <text x="62" y="744" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="#050505">TOTAL</text>
  <text x="538" y="744" text-anchor="end" font-family="Arial, sans-serif" font-size="32" font-weight="900" fill="#050505">${formatMoney(invoice.total)}</text>
  <text x="300" y="802" text-anchor="middle" class="muted">Thank you for choosing Click Sip</text>
</svg>`;
  },

  async generateInvoiceImage(invoiceId: string): Promise<string> {
    return `/api/invoice-image?id=${invoiceId}`;
  },
};
