import { CustomerService } from "@/services/customer.service";
import { ItemService } from "@/services/item.service";
import { TransactionService } from "@/services/transaction.service";
import { CustomerSelector } from "@/components/transactions/customer-selector";
import { LiveTransactionsSection } from "@/components/transactions/live-transactions-section";
import { TransactionHistory } from "@/components/transactions/transaction-history";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Separator } from "@/components/ui/separator";
import { Receipt } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const [customers, items, transactions, liveTransactions] = await Promise.all([
    CustomerService.getAll(),
    ItemService.getActive(),
    TransactionService.getAll(),
    TransactionService.getLiveSummaries(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Add daily purchases for your customers"
      />

      {customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Add customers first before creating transactions"
          icon={<Receipt className="h-8 w-8 text-muted-foreground" />}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No items yet"
          description="Add menu items first before creating transactions"
          icon={<Receipt className="h-8 w-8 text-muted-foreground" />}
        />
      ) : (
        <CustomerSelector customers={customers} items={items} />
      )}

      <LiveTransactionsSection liveTransactions={liveTransactions} />

      {transactions.length > 0 && (
        <>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
            <TransactionHistory transactions={transactions} />
          </div>
        </>
      )}
    </div>
  );
}
