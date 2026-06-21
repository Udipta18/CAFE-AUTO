import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Clock,
  CheckCircle2,
  CreditCard,
  Users,
  FileText,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { DashboardStats } from "@/types";

interface StatCardsProps {
  stats: DashboardStats;
}

const STAT_CONFIGS = [
  {
    key: "totalRevenue" as const,
    label: "Total Revenue",
    icon: DollarSign,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    format: "currency" as const,
  },
  {
    key: "outstandingAmount" as const,
    label: "Outstanding",
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    format: "currency" as const,
  },
  {
    key: "approvedAmount" as const,
    label: "Approved",
    icon: CheckCircle2,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    format: "currency" as const,
  },
  {
    key: "paidAmount" as const,
    label: "Paid",
    icon: CreditCard,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    format: "currency" as const,
  },
  {
    key: "totalCustomers" as const,
    label: "Customers",
    icon: Users,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-500/10",
    format: "number" as const,
  },
  {
    key: "totalInvoices" as const,
    label: "Invoices",
    icon: FileText,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-500/10",
    format: "number" as const,
  },
];

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {STAT_CONFIGS.map((config) => {
        const Icon = config.icon;
        const value = stats[config.key];
        const displayValue =
          config.format === "currency"
            ? formatCurrency(value)
            : value.toString();

        return (
          <Card key={config.key} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {config.label}
              </CardTitle>
              <div className={`rounded-lg p-2 ${config.bgColor}`}>
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{displayValue}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
