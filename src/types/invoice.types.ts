export type InvoiceStatus = "PENDING" | "APPROVED" | "DISPUTED" | "PAID";

export interface Invoice {
  id: string;
  token: string;
  customerId: string;
  total: string;
  status: InvoiceStatus;
  approvedAt: Date | null;
  paidAt: Date | null;
  createdAt: Date;
}

export interface InvoiceWithCustomer extends Invoice {
  customerName: string;
  customerPhone: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  itemName: string;
  quantity: number;
  amount: string;
}

export interface InvoiceDetail extends InvoiceWithCustomer {
  items: InvoiceItem[];
}
