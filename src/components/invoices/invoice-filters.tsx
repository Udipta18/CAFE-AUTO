"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InvoiceFiltersProps {
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

const FILTER_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "DISPUTED", label: "Disputed" },
  { value: "PAID", label: "Paid" },
];

export function InvoiceFilters({
  activeStatus,
  onStatusChange,
}: InvoiceFiltersProps) {
  return (
    <Tabs value={activeStatus} onValueChange={onStatusChange}>
      <TabsList>
        {FILTER_OPTIONS.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            className="text-xs sm:text-sm"
            id={`filter-${option.value.toLowerCase()}`}
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
