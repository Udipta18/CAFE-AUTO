import { supabase } from "@/lib/supabase";
import { TransactionRepository } from "@/repositories/transaction.repository";
import type { DashboardStats, MonthlyRevenue } from "@/types";

export const AnalyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    // Fetch total and status from all invoices
    const { data: allInvoices, error: invErr } = await supabase
      .from("invoices")
      .select("total, status");

    if (invErr) throw invErr;

    // Fetch total customer count
    const { count: customerCount, error: custErr } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true });

    if (custErr) throw custErr;

    let totalRevenue = 0;
    let outstandingAmount = 0;
    let approvedAmount = 0;
    let paidAmount = 0;

    if (allInvoices) {
      for (const inv of allInvoices) {
        const val = parseFloat(inv.total);
        totalRevenue += val;
        if (inv.status === "PENDING" || inv.status === "APPROVED") {
          outstandingAmount += val;
        }
        if (inv.status === "APPROVED") {
          approvedAmount += val;
        }
        if (inv.status === "PAID") {
          paidAmount += val;
        }
      }
    }

    return {
      totalRevenue,
      outstandingAmount,
      approvedAmount,
      paidAmount,
      totalCustomers: customerCount ?? 0,
      totalInvoices: allInvoices ? allInvoices.length : 0,
    };
  },

  async getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
    const { data, error } = await supabase
      .from("invoices")
      .select("total, created_at");

    if (error) throw error;

    // Group by month
    const groups: { [key: string]: { date: Date; total: number } } = {};
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (const inv of data || []) {
      const date = new Date(inv.created_at);
      const monthStr = `${months[date.getMonth()]} ${date.getFullYear()}`;

      if (!groups[monthStr]) {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        groups[monthStr] = { date: startOfMonth, total: 0 };
      }
      groups[monthStr].total += parseFloat(inv.total);
    }

    // Convert to array and sort chronologically
    const monthlyRev = Object.keys(groups).map((month) => ({
      month,
      revenue: groups[month].total,
      date: groups[month].date,
    }));

    monthlyRev.sort((a, b) => a.date.getTime() - b.date.getTime());

    return monthlyRev.map((item) => ({
      month: item.month,
      revenue: item.revenue,
    }));
  },

  async getRecentTransactions(limit: number = 10) {
    return TransactionRepository.getRecent(limit);
  },
};
