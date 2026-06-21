"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { addTransaction } from "@/actions/transaction.actions";
import { formatCurrency } from "@/utils/formatters";
import type { Item } from "@/types";

interface TransactionPanelProps {
  customerId: string;
  items: Item[];
}

export function TransactionPanel({ customerId, items }: TransactionPanelProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isPending, startTransition] = useTransition();

  function updateQuantity(itemId: string, delta: number) {
    setQuantities((prev) => {
      const current = prev[itemId] ?? 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [itemId]: next };
    });
  }

  function getRunningTotal(): number {
    return items.reduce((total, item) => {
      const qty = quantities[item.id] ?? 0;
      return total + qty * parseFloat(item.price);
    }, 0);
  }

  function handleAddAll() {
    const itemsToAdd = items.filter((item) => (quantities[item.id] ?? 0) > 0);
    if (itemsToAdd.length === 0) {
      toast.error("Select at least one item");
      return;
    }

    startTransition(async () => {
      try {
        for (const item of itemsToAdd) {
          const qty = quantities[item.id] ?? 0;
          if (qty > 0) {
            const result = await addTransaction({
              customerId,
              itemId: item.id,
              quantity: qty,
            });
            if (!result.success) {
              toast.error(result.error);
              return;
            }
          }
        }
        toast.success("Transactions added successfully");
        setQuantities({});
      } catch {
        toast.error("Failed to add transactions");
      }
    });
  }

  const runningTotal = getRunningTotal();
  const hasItems = Object.values(quantities).some((q) => q > 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          const qty = quantities[item.id] ?? 0;
          return (
            <Card
              key={item.id}
              className={`transition-all duration-200 ${
                qty > 0
                  ? "ring-2 ring-primary/50 shadow-md"
                  : "hover:shadow-sm"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-primary font-semibold text-lg">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  {qty > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {formatCurrency(qty * parseFloat(item.price))}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={qty === 0}
                    id={`qty-minus-${item.id}`}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-semibold tabular-nums">
                    {qty}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.id, 1)}
                    id={`qty-plus-${item.id}`}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Running total + submit */}
      <Card className="sticky bottom-4 shadow-lg border-primary/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Running Total</p>
            <p className="text-2xl font-bold">{formatCurrency(runningTotal)}</p>
          </div>
          <Button
            size="lg"
            onClick={handleAddAll}
            disabled={!hasItems || isPending}
            id="add-to-bill-btn"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isPending ? "Adding..." : "Add to Bill"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
