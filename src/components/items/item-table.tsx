"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteItem } from "@/actions/item.actions";
import { ItemForm } from "./item-form";
import { formatCurrency } from "@/utils/formatters";
import { getItemEmoji } from "@/utils/item-icons";
import type { Item } from "@/types";

interface ItemTableProps {
  items: Item[];
}

export function ItemTable({ items }: ItemTableProps) {
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    const result = await deleteItem(id);
    if (result.success) {
      toast.success("Item deleted");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-xl">
                    {getItemEmoji(item.name)}
                  </span>
                  <span>{item.name}</span>
                </div>
              </TableCell>
              <TableCell>{formatCurrency(item.price)}</TableCell>
              <TableCell>
                <Badge
                  variant={item.active ? "default" : "secondary"}
                  className="text-xs"
                >
                  {item.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <ItemForm
                      item={item}
                      trigger={
                        <DropdownMenuItem
                          onClick={(e) => e.preventDefault()}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      }
                    />
                    <DropdownMenuItem
                      onClick={() => handleDelete(item.id)}
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
