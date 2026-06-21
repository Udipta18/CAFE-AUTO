"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FilePlus } from "lucide-react";
import { toast } from "sonner";
import { generateInvoice } from "@/actions/invoice.actions";
import type { Customer } from "@/types";
import { useTransition } from "react";

interface GenerateInvoiceDialogProps {
  customers: Customer[];
}

export function GenerateInvoiceDialog({
  customers,
}: GenerateInvoiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function handleValueChange(value: string | null) {
    setSelectedCustomerId(value ?? "");
  }

  function handleGenerate() {
    if (!selectedCustomerId) {
      toast.error("Please select a customer");
      return;
    }

    startTransition(async () => {
      try {
        const result = await generateInvoice(selectedCustomerId);
        if (result.success) {
          toast.success("Invoice generated successfully");
          setOpen(false);
          setSelectedCustomerId("");
        } else {
          toast.error(result.error);
        }
      } catch {
        toast.error("Failed to generate invoice");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button id="generate-invoice-btn">
            <FilePlus className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Invoice</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will aggregate all unbilled transactions for the selected
            customer into a new invoice.
          </p>
          <div className="space-y-2">
            <Label htmlFor="invoice-customer-select">Customer</Label>
            <Select
              value={selectedCustomerId}
              onValueChange={handleValueChange}
            >
              <SelectTrigger id="invoice-customer-select">
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!selectedCustomerId || isPending}
            >
              {isPending ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
