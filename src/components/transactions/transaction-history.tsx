import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { STATUS_COLORS, STATUS_LABELS } from "@/constants";

interface TransactionHistoryProps {
  transactions: {
    id: string;
    customerName: string | null;
    itemName: string | null;
    quantity: number;
    amount: string;
    invoiceId: string | null;
    invoiceStatus?: string | null;
    createdAt: Date;
  }[];
}

export function TransactionHistory({
  transactions,
}: TransactionHistoryProps) {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Item</TableHead>
            <TableHead className="text-center">Qty</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-medium">
                {tx.customerName ?? "—"}
              </TableCell>
              <TableCell>{tx.itemName ?? "—"}</TableCell>
              <TableCell className="text-center">{tx.quantity}</TableCell>
              <TableCell>{formatCurrency(tx.amount)}</TableCell>
              <TableCell>
                {tx.invoiceStatus ? (
                  <Badge className={STATUS_COLORS[tx.invoiceStatus]}>
                    {STATUS_LABELS[tx.invoiceStatus] ?? tx.invoiceStatus}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Unbilled
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDateTime(tx.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
