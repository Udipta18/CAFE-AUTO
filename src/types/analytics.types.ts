export interface DashboardStats {
  totalRevenue: number;
  outstandingAmount: number;
  approvedAmount: number;
  paidAmount: number;
  totalCustomers: number;
  totalInvoices: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface RecentTransaction {
  id: string;
  customerName: string;
  itemName: string;
  quantity: number;
  amount: string;
  createdAt: Date;
}
