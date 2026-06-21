import { InvoiceService } from "@/services/invoice.service";
import { CustomerService } from "@/services/customer.service";
import { InvoiceListClient } from "@/components/invoices/invoice-list-client";
import { GenerateInvoiceDialog } from "@/components/invoices/generate-invoice-dialog";
import { PageHeader } from "@/components/layout/page-header";
import type { InvoiceDetail } from "@/types";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const [invoicesRaw, customers] = await Promise.all([
    InvoiceService.getAll(),
    CustomerService.getAll(),
  ]);

  // Enrich each invoice with its items
  const invoices: InvoiceDetail[] = await Promise.all(
    invoicesRaw.map(async (inv) => {
      const detail = await InvoiceService.getById(inv.id);
      return {
        ...inv,
        customerName: inv.customerName ?? "",
        customerPhone: inv.customerPhone ?? "",
        items: detail.items,
      };
    })
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Generate and manage customer invoices"
      >
        <GenerateInvoiceDialog customers={customers} />
      </PageHeader>

      <InvoiceListClient invoices={invoices} />
    </div>
  );
}
