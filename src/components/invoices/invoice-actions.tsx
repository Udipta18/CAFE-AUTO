"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface InvoiceActionsProps {
  token: string;
  status: string;
}

export function InvoiceActions({ token, status }: InvoiceActionsProps) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(action: "approve" | "dispute") {
    setLoading(action);
    try {
      const res = await fetch(`/api/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (data.success) {
        setCurrentStatus(action === "approve" ? "APPROVED" : "DISPUTED");
        toast.success(
          action === "approve" ? "Invoice approved!" : "Invoice disputed"
        );
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Failed to process request");
    } finally {
      setLoading(null);
    }
  }

  if (currentStatus === "APPROVED") {
    return (
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
          <span className="text-lg font-semibold">Approved</span>
        </div>
        <p className="text-muted-foreground">
          Payment Pending — Thank you for confirming.
        </p>
      </div>
    );
  }

  if (currentStatus === "DISPUTED") {
    return (
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <span className="text-lg font-semibold">Disputed</span>
        </div>
        <p className="text-muted-foreground">
          Please contact Click Sip regarding this invoice.
        </p>
      </div>
    );
  }

  if (currentStatus === "PAID") {
    return (
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
          <span className="text-lg font-semibold">Approved & Paid</span>
        </div>
        <p className="text-muted-foreground">Thank you!</p>
      </div>
    );
  }

  // PENDING
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
      <Button
        onClick={() => handleAction("approve")}
        disabled={loading !== null}
        className="h-[62px] min-w-[206px] rounded-lg bg-[#238235] text-[20px] font-black uppercase text-white shadow-sm hover:bg-[#1d742d]"
        size="lg"
        id="approve-invoice-btn"
      >
        {loading === "approve" ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4 mr-2" />
        )}
        APPROVE
      </Button>
      <Button
        onClick={() => handleAction("dispute")}
        disabled={loading !== null}
        className="h-[62px] min-w-[206px] rounded-lg bg-[#df171d] text-[20px] font-black uppercase text-white shadow-sm hover:bg-[#c9151b]"
        size="lg"
        id="dispute-invoice-btn"
      >
        {loading === "dispute" ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <AlertTriangle className="h-4 w-4 mr-2" />
        )}
        DISPUTE
      </Button>
    </div>
  );
}
