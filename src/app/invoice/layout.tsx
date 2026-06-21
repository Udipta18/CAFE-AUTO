import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice — Cafe ABC",
  description: "View and approve your invoice from Cafe ABC",
};

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
