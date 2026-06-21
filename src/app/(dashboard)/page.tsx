import { AnalyticsService } from "@/services/analytics.service";
import { StatCards } from "@/components/analytics/stat-cards";
import { RevenueChart } from "@/components/analytics/revenue-chart";
import { RecentTransactions } from "@/components/analytics/recent-transactions";
import { PageHeader } from "@/components/layout/page-header";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, monthlyRevenue, recentTransactions] = await Promise.all([
    AnalyticsService.getDashboardStats(),
    AnalyticsService.getMonthlyRevenue(),
    AnalyticsService.getRecentTransactions(10),
  ]);

  // Map recent transactions to the expected type
  const mappedTransactions = recentTransactions.map((tx) => ({
    id: tx.id,
    customerName: tx.customerName ?? "Unknown",
    itemName: tx.itemName ?? "Unknown",
    quantity: tx.quantity,
    amount: tx.amount,
    createdAt: tx.createdAt,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your cafe billing system"
      />

      <StatCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={monthlyRevenue} />
        <RecentTransactions transactions={mappedTransactions} />
      </div>
    </div>
  );
}
