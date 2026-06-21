"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { InvoiceDetailDialog } from "./invoice-detail-dialog";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { STATUS_COLORS, STATUS_LABELS } from "@/constants";
import type { InvoiceDetail } from "@/types";

interface InvoiceTableProps {
  invoices: InvoiceDetail[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">
                {invoice.customerName}
              </TableCell>
              <TableCell className="font-semibold">
                {formatCurrency(invoice.total)}
              </TableCell>
              <TableCell>
                <Badge className={STATUS_COLORS[invoice.status]}>
                  {STATUS_LABELS[invoice.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(invoice.createdAt)}
              </TableCell>
              <TableCell>
                <InvoiceDetailDialog invoice={invoice} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
