import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Activity } from "lucide-react";
import { formatCurrency, formatRelativeDate } from "@/utils/formatters";
import type { RecentTransaction } from "@/types";

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
}

export function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
        <CardDescription>Latest customer purchases</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No transactions yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">
                    {tx.customerName}
                  </TableCell>
                  <TableCell>{tx.itemName}</TableCell>
                  <TableCell className="text-center">{tx.quantity}</TableCell>
                  <TableCell>{formatCurrency(tx.amount)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatRelativeDate(tx.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
