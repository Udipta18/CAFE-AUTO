import { APP_NAME, CURRENCY_SYMBOL } from "@/constants";
import type { InvoiceDetail } from "@/types";

export function generateInvoiceHtml(invoice: InvoiceDetail): string {
  const formattedDate = new Date(invoice.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  const itemRows = invoice.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;">${item.itemName}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${CURRENCY_SYMBOL}${parseFloat(item.amount).toLocaleString("en-IN")}</td>
    </tr>
  `
    )
    .join("");

  const statusColor =
    invoice.status === "PAID"
      ? "#10b981"
      : invoice.status === "APPROVED"
      ? "#3b82f6"
      : invoice.status === "DISPUTED"
      ? "#ef4444"
      : "#f59e0b";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9fafb; padding: 20px; }
  </style>
</head>
<body>
  <div style="max-width: 400px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e293b, #334155); padding: 24px; text-align: center; color: white;">
      <div style="font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">${APP_NAME}</div>
      <div style="font-size: 12px; opacity: 0.7; margin-top: 4px;">INVOICE</div>
    </div>

    <!-- Customer & Date -->
    <div style="padding: 20px 24px; display: flex; justify-content: space-between; border-bottom: 1px solid #e5e7eb;">
      <div>
        <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Customer</div>
        <div style="font-size: 16px; font-weight: 600; color: #111827; margin-top: 2px;">${invoice.customerName}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Date</div>
        <div style="font-size: 14px; color: #111827; margin-top: 2px;">${formattedDate}</div>
      </div>
    </div>

    <!-- Items -->
    <div style="padding: 0 24px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">
            <th style="padding: 12px 12px 8px; text-align: left;">Item</th>
            <th style="padding: 12px 12px 8px; text-align: center;">Qty</th>
            <th style="padding: 12px 12px 8px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>
    </div>

    <!-- Total -->
    <div style="margin: 16px 24px; padding: 16px; background: #f8fafc; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 16px; font-weight: 700; color: #111827;">Total</span>
      <span style="font-size: 24px; font-weight: 700; color: #111827;">${CURRENCY_SYMBOL}${parseFloat(invoice.total).toLocaleString("en-IN")}</span>
    </div>

    <!-- Status -->
    <div style="padding: 0 24px 24px; text-align: center;">
      <span style="display: inline-block; padding: 6px 16px; background: ${statusColor}20; color: ${statusColor}; border-radius: 100px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${invoice.status}</span>
    </div>

    <!-- Footer -->
    <div style="padding: 16px 24px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
      <div style="font-size: 11px; color: #9ca3af;">Thank you for your business!</div>
    </div>
  </div>
</body>
</html>`;
}
