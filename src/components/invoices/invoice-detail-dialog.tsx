"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  MessageCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { markInvoicePaid } from "@/actions/invoice.actions";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  buildWhatsAppLink,
  buildInvoiceMessage,
  buildInvoiceUrl,
} from "@/utils/url";
import { STATUS_COLORS, STATUS_LABELS } from "@/constants";
import { cn } from "@/lib/utils";
import type { InvoiceDetail } from "@/types";

interface InvoiceDetailDialogProps {
  invoice: InvoiceDetail;
  trigger?: React.ReactElement;
}

export function InvoiceDetailDialog({
  invoice,
  trigger,
}: InvoiceDetailDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleMarkPaid() {
    startTransition(async () => {
      try {
        const result = await markInvoicePaid(invoice.id);
        if (result.success) {
          toast.success("Invoice marked as paid");
          setOpen(false);
        } else {
          toast.error(result.error);
        }
      } catch {
        toast.error("Failed to mark as paid");
      }
    });
  }

  function getWhatsAppLink() {
    const message = buildInvoiceMessage(
      invoice.customerName ?? "Customer",
      invoice.token,
      invoice.total
    );
    return buildWhatsAppLink(invoice.customerPhone ?? "", message);
  }

  function handleCopyLink() {
    const url = buildInvoiceUrl(invoice.token);
    navigator.clipboard.writeText(url);
    toast.success("Invoice link copied to clipboard");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger || (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Invoice Details</span>
            <Badge className={STATUS_COLORS[invoice.status]}>
              {STATUS_LABELS[invoice.status]}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Customer</p>
              <p className="font-medium">{invoice.customerName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(invoice.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{invoice.customerPhone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Token</p>
              <p className="font-mono text-xs truncate">{invoice.token}</p>
            </div>
          </div>

          <Separator />

          {/* Items table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(invoice.total)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "flex-1"
              )}
              id="whatsapp-share-btn"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Share on WhatsApp
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="flex-1"
              id="copy-invoice-link-btn"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(`/invoice/${invoice.token}`, "_blank")
              }
              className="flex-1"
              id="view-invoice-btn"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Page
            </Button>
          </div>

          {invoice.status === "APPROVED" && (
            <Button
              onClick={handleMarkPaid}
              disabled={isPending}
              className="w-full"
              id="mark-paid-btn"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {isPending ? "Marking as Paid..." : "Mark as Paid"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
