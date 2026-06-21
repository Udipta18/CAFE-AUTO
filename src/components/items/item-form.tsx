"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createItem, updateItem } from "@/actions/item.actions";
import type { Item } from "@/types";

interface ItemFormProps {
  item?: Item;
  trigger?: React.ReactElement;
}

export function ItemForm({ item, trigger }: ItemFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(item?.name ?? "");
  const [price, setPrice] = useState(item?.price ?? "");

  const isEditing = !!item;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = isEditing
        ? await updateItem({
            id: item.id,
            name,
            price,
            active: item.active,
          })
        : await createItem({ name, price });

      if (result.success) {
        toast.success(isEditing ? "Item updated" : "Item added");
        setOpen(false);
        if (!isEditing) {
          setName("");
          setPrice("");
        }
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger || (
            <Button id="add-item-btn">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item-name">Name</Label>
            <Input
              id="item-name"
              placeholder="e.g., Tea, Coffee, Sandwich"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-price">Price (₹)</Label>
            <Input
              id="item-price"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g., 20"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
