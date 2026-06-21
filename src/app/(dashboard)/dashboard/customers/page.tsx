import { CustomerService } from "@/services/customer.service";
import { CustomerTable } from "@/components/customers/customer-table";
import { CustomerForm } from "@/components/customers/customer-form";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await CustomerService.getAll();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your cafe customers"
      >
        <CustomerForm />
      </PageHeader>

      {customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Add your first customer to get started"
          icon={<Users className="h-8 w-8 text-muted-foreground" />}
        >
          <CustomerForm />
        </EmptyState>
      ) : (
        <CustomerTable customers={customers} />
      )}
    </div>
  );
}
