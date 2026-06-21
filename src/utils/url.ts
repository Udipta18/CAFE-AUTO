import { APP_NAME } from "@/constants";

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function buildInvoiceUrl(token: string): string {
  return `${getAppUrl()}/invoice/${token}`;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const phoneWithCountry = cleanPhone.startsWith("91")
    ? cleanPhone
    : `91${cleanPhone}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`;
}

export function buildInvoiceMessage(
  customerName: string,
  token: string,
  total: string
): string {
  const url = buildInvoiceUrl(token);
  return `Hello ${customerName},\n\nYour invoice of ₹${total} from ${APP_NAME} is ready.\n\nPlease review and approve using this link:\n\n${url}\n\nThank you!`;
}
