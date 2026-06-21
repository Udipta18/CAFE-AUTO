"use client";

import { Fragment, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  generateInvoice,
  generatePaidInvoice,
} from "@/actions/invoice.actions";
import {
  buildInvoiceMessage,
  buildWhatsAppLink,
} from "@/utils/url";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import {
  Banknote,
  CalendarClock,
  ChevronDown,
  ExternalLink,
  ReceiptText,
} from "lucide-react";
import { toast } from "sonner";
import type { LiveTransactionSummary } from "@/types";

interface LiveTransactionsSectionProps {
  liveTransactions: LiveTransactionSummary[];
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12.04 2C6.57 2 2.12 6.45 2.12 11.92c0 1.75.46 3.46 1.33 4.96L2.03 22l5.25-1.38a9.83 9.83 0 0 0 4.76 1.21h.01c5.47 0 9.92-4.45 9.92-9.92C21.97 6.45 17.52 2 12.04 2Zm0 18.16h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.25-4.39c0-4.55 3.7-8.25 8.25-8.25 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.42 5.83c-.02 4.55-3.72 8.24-8.27 8.24Zm4.52-6.17c-.25-.12-1.47-.73-1.7-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.04s.88 2.37 1 2.53c.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

export function LiveTransactionsSection({
  liveTransactions,
}: LiveTransactionsSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [whatsAppLinks, setWhatsAppLinks] = useState<Record<string, string>>(
    {}
  );
  const [receiptImages, setReceiptImages] = useState<Record<string, string>>(
    {}
  );
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  function toggleExpanded(customerId: string) {
    setExpandedRows((current) => ({
      ...current,
      [customerId]: !current[customerId],
    }));
  }

  async function sharePaidInvoiceImage(
    summary: LiveTransactionSummary,
    invoiceId: string,
    targetWindow: Window | null
  ) {
    let imageData;
    try {
      const imageResponse = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      imageData = await imageResponse.json();
    } catch (err) {
      targetWindow?.close();
      throw err;
    }

    if (!imageData.success || !imageData.imageUrl) {
      targetWindow?.close();
      throw new Error(imageData.error || "Failed to generate receipt image");
    }

    setReceiptImages((current) => ({
      ...current,
      [summary.customerId]: imageData.imageUrl,
    }));

    const fileResponse = await fetch(imageData.imageUrl);
    const blob = await fileResponse.blob();
    const extension = imageData.imageUrl.split(".").pop() || "svg";
    const file = new File([blob], `click-sip-receipt-${invoiceId}.${extension}`, {
      type: blob.type || "image/svg+xml",
    });

    try {
      if (
        navigator.canShare?.({ files: [file] }) &&
        typeof navigator.share === "function"
      ) {
        await navigator.share({
          files: [file],
          title: "Click Sip paid receipt",
          text: `${summary.customerName} paid ${formatCurrency(summary.total)} at Click Sip.`,
        });
        targetWindow?.close();
        return;
      }
    } catch (shareError) {
      console.error("Web Share failed:", shareError);
    }

    if (targetWindow) {
      targetWindow.location.assign(imageData.imageUrl);
    } else {
      window.open(imageData.imageUrl, "_blank", "noopener,noreferrer");
    }
    toast.info("Receipt image opened. Share or download it to send on WhatsApp.");
  }

  async function shareExistingReceiptImage(
    summary: LiveTransactionSummary,
    imageUrl: string
  ) {
    try {
      const fileResponse = await fetch(imageUrl);
      const blob = await fileResponse.blob();
      const extension = imageUrl.split(".").pop() || "svg";
      const file = new File(
        [blob],
        `click-sip-receipt-${summary.customerId}.${extension}`,
        {
          type: blob.type || "image/svg+xml",
        }
      );

      if (
        navigator.canShare?.({ files: [file] }) &&
        typeof navigator.share === "function"
      ) {
        await navigator.share({
          files: [file],
          title: "Click Sip paid receipt",
          text: `${summary.customerName} paid ${formatCurrency(summary.total)} at Click Sip.`,
        });
        return;
      }

      window.open(imageUrl, "_blank", "noopener,noreferrer");
      toast.info("Receipt image opened. Share or download it to send on WhatsApp.");
    } catch {
      toast.error("Failed to share receipt image");
    }
  }

  function handleSendInvoice(
    summary: LiveTransactionSummary,
    mode: "paid-now" | "pay-later"
  ) {
    const imageWindow =
      mode === "paid-now" ? window.open("about:blank", "_blank") : null;
    const whatsAppWindow =
      mode === "pay-later" ? window.open("about:blank", "_blank") : null;

    startTransition(async () => {
      try {
        const result =
          mode === "paid-now"
            ? await generatePaidInvoice(summary.customerId)
            : await generateInvoice(summary.customerId);

        if (!result.success || !result.data) {
          whatsAppWindow?.close();
          imageWindow?.close();
          toast.error(result.error);
          return;
        }

        const invoice = result.data;
        if (mode === "paid-now") {
          await sharePaidInvoiceImage(summary, invoice.id, imageWindow);
          toast.success("Paid receipt image is ready to share");
          return;
        }

        const message =
          buildInvoiceMessage(
            summary.customerName,
            invoice.token,
            invoice.total
          );
        const link = buildWhatsAppLink(summary.customerPhone, message);

        setWhatsAppLinks((current) => ({
          ...current,
          [summary.customerId]: link,
        }));

        if (whatsAppWindow) {
          whatsAppWindow.location.assign(link);
        } else {
          toast.info("Click Open WhatsApp to send the invoice.");
        }

        toast.success(
          "Pay later WhatsApp link is ready"
        );
      } catch {
        whatsAppWindow?.close();
        imageWindow?.close();
        toast.error("Failed to generate invoice");
      }
    });
  }

  if (liveTransactions.length === 0) {
    return (
      <section className="rounded-lg border border-dashed border-border p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
            <ReceiptText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Live Transactions</h2>
            <p className="text-sm text-muted-foreground">
              No active customer bills right now.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Live Transactions</h2>
          <p className="text-sm text-muted-foreground">
            Current unbilled customer activity ready for invoice approval.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          {liveTransactions.length} active bill
          {liveTransactions.length === 1 ? "" : "s"}
        </Badge>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Current Bill</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Send</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {liveTransactions.map((summary) => {
              const isExpanded = expandedRows[summary.customerId] ?? false;
              const previewItems = summary.items.slice(0, 3);

              return (
                <Fragment key={summary.customerId}>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">{summary.customerName}</div>
                      <div className="text-xs text-muted-foreground">
                        {summary.customerPhone || "No phone saved"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">
                        {formatCurrency(summary.total)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {summary.transactionCount} transaction
                        {summary.transactionCount === 1 ? "" : "s"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => toggleExpanded(summary.customerId)}
                        className="group flex max-w-xl flex-wrap items-center gap-1 text-left"
                        aria-expanded={isExpanded}
                        id={`toggle-live-items-${summary.customerId}`}
                      >
                        {previewItems.map((item) => (
                          <Badge
                            key={item.itemName}
                            variant="outline"
                            className="font-normal"
                          >
                            {item.itemName} x{item.quantity}
                          </Badge>
                        ))}
                        {summary.items.length > 3 && (
                          <Badge variant="outline" className="font-normal">
                            +{summary.items.length - 3}
                          </Badge>
                        )}
                        <span className="ml-1 inline-flex items-center gap-1 text-xs font-semibold text-primary underline-offset-4 group-hover:underline">
                          {isExpanded ? "Hide" : "View all"}
                          <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </span>
                      </button>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(summary.lastActivityAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-2">
                    {receiptImages[summary.customerId] ? (
                      <div className="flex flex-col items-end gap-1">
                        <Button
                          size="sm"
                          onClick={() =>
                            shareExistingReceiptImage(
                              summary,
                              receiptImages[summary.customerId]
                            )
                          }
                          id={`share-paid-receipt-${summary.customerId}`}
                        >
                          <WhatsAppIcon className="mr-2 h-4 w-4" />
                          Share Image
                        </Button>
                        <a
                          href={receiptImages[summary.customerId]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary underline-offset-4 hover:underline"
                          id={`open-paid-receipt-${summary.customerId}`}
                        >
                          Preview receipt
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ) : whatsAppLinks[summary.customerId] ? (
                      <a
                        href={whatsAppLinks[summary.customerId]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-7 items-center justify-center gap-1 rounded-lg bg-primary px-2.5 text-[0.8rem] font-medium text-primary-foreground transition-all hover:bg-primary/80"
                            id={`open-live-whatsapp-${summary.customerId}`}
                          >
                            <WhatsAppIcon className="h-3.5 w-3.5" />
                            Open WhatsApp
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleSendInvoice(summary, "paid-now")
                              }
                              disabled={isPending || !summary.customerPhone}
                              id={`send-paid-live-invoice-${summary.customerId}`}
                              title="Customer paid now. Mark invoice paid and send receipt."
                            >
                              <Banknote className="mr-2 h-4 w-4" />
                              Paid Now
                              <WhatsAppIcon className="ml-1 h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleSendInvoice(summary, "pay-later")
                              }
                              disabled={isPending || !summary.customerPhone}
                              id={`send-pay-later-live-invoice-${summary.customerId}`}
                              title="Customer will pay later. Send approval link."
                            >
                              <CalendarClock className="mr-2 h-4 w-4" />
                              Pay Later
                              <WhatsAppIcon className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <TableRow key={`${summary.customerId}-items`}>
                      <TableCell colSpan={5} className="bg-muted/30">
                        <div className="rounded-lg border border-border bg-background p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-semibold">
                              Full item breakdown
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {summary.itemCount} items total
                            </p>
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {summary.items.map((item) => (
                              <div
                                key={item.itemName}
                                className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2"
                              >
                                <div>
                                  <p className="text-sm font-medium">
                                    {item.itemName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Qty {item.quantity}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold">
                                  {formatCurrency(item.amount)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
