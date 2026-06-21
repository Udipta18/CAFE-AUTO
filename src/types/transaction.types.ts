export interface Transaction {
  id: string;
  customerId: string;
  itemId: string;
  quantity: number;
  amount: string;
  invoiceId: string | null;
  invoiceStatus?: string | null;
  invoiceToken?: string | null;
  createdAt: Date;
}

export interface TransactionWithDetails extends Transaction {
  customerName: string;
  itemName: string;
  customerPhone?: string | null;
}

export interface CreateTransactionInput {
  customerId: string;
  itemId: string;
  quantity: number;
}

export interface LiveTransactionItem {
  itemName: string;
  quantity: number;
  amount: string;
}

export interface LiveTransactionSummary {
  customerId: string;
  customerName: string;
  customerPhone: string;
  total: string;
  transactionCount: number;
  itemCount: number;
  lastActivityAt: Date;
  items: LiveTransactionItem[];
}
