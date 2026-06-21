import { ItemService } from "@/services/item.service";
import { ItemTable } from "@/components/items/item-table";
import { ItemForm } from "@/components/items/item-form";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Coffee } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ItemsPage() {
  const items = await ItemService.getAll();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Items"
        description="Manage your menu items and prices"
      >
        <ItemForm />
      </PageHeader>

      {items.length === 0 ? (
        <EmptyState
          title="No items yet"
          description="Add menu items like Tea, Coffee, Sandwich to get started"
          icon={<Coffee className="h-8 w-8 text-muted-foreground" />}
        >
          <ItemForm />
        </EmptyState>
      ) : (
        <ItemTable items={items} />
      )}
    </div>
  );
}
