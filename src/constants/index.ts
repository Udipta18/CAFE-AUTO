export const APP_NAME = "Click Sip";
export const CURRENCY_SYMBOL = "₹";
export const CURRENCY_LOCALE = "en-IN";

export const INVOICE_STATUSES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  DISPUTED: "DISPUTED",
  PAID: "PAID",
} as const;

export type InvoiceStatusKey = keyof typeof INVOICE_STATUSES;

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  DISPUTED: "Disputed",
  PAID: "Paid",
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-400 text-black",
  APPROVED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  DISPUTED: "bg-red-500/15 text-red-700 dark:text-red-300",
  PAID: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
};

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" as const },
  { label: "Customers", href: "/dashboard/customers", icon: "Users" as const },
  { label: "Items", href: "/dashboard/items", icon: "Coffee" as const },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: "Receipt" as const,
  },
  {
    label: "Invoices",
    href: "/dashboard/invoices",
    icon: "FileText" as const,
  },
] as const;

export const ITEMS_PER_PAGE = 20;
