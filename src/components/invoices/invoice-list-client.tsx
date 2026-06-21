"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { InvoiceTable } from "./invoice-table";
import { InvoiceFilters } from "./invoice-filters";
import { EmptyState } from "@/components/layout/empty-state";
import type { InvoiceDetail } from "@/types";

interface InvoiceListClientProps {
  invoices: InvoiceDetail[];
}

export function InvoiceListClient({ invoices }: InvoiceListClientProps) {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesStatus =
        statusFilter === "ALL" || invoice.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        (invoice.customerName ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [invoices, statusFilter, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <InvoiceFilters
          activeStatus={statusFilter}
          onStatusChange={setStatusFilter}
        />
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            id="invoice-search"
          />
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <EmptyState
          title="No invoices found"
          description={
            searchQuery || statusFilter !== "ALL"
              ? "Try adjusting your filters"
              : "Generate your first invoice from unbilled transactions"
          }
        />
      ) : (
        <InvoiceTable invoices={filteredInvoices} />
      )}
    </div>
  );
}
