"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TransactionPanel } from "./transaction-panel";
import { Phone, UserRound } from "lucide-react";
import type { Customer, Item } from "@/types";

interface CustomerSelectorProps {
  customers: Customer[];
  items: Item[];
}

export function CustomerSelector({
  customers,
  items,
}: CustomerSelectorProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  function handleValueChange(value: string | null) {
    setSelectedCustomerId(value ?? "");
  }

  const selectedCustomer = customers.find(
    (customer) => customer.id === selectedCustomerId
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <Label htmlFor="customer-select" className="text-base font-bold">
              Select Customer
            </Label>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose who you are adding items to.
            </p>
          </div>
          {selectedCustomer && <Badge variant="secondary">Selected</Badge>}
        </div>
        <Select value={selectedCustomerId} onValueChange={handleValueChange}>
          <SelectTrigger
            id="customer-select"
            className="h-auto min-h-12 w-full max-w-xl justify-between px-3 py-2"
          >
            {selectedCustomer ? (
              <span className="flex min-w-0 items-center gap-3 text-left">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">
                    {selectedCustomer.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {selectedCustomer.phone}
                  </span>
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">Choose a customer</span>
            )}
          </SelectTrigger>
          <SelectContent className="min-w-72">
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                <span className="flex min-w-0 flex-col">
                  <span className="font-medium">{customer.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {customer.phone}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCustomer && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">{selectedCustomer.name}</p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  {selectedCustomer.phone}
                </p>
              </div>
            </div>
            <Badge className="w-fit">Current bill</Badge>
          </div>
          <TransactionPanel customerId={selectedCustomerId} items={items} />
        </div>
      )}
    </div>
  );
}
