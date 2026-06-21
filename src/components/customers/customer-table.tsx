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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteCustomer } from "@/actions/customer.actions";
import { CustomerForm } from "./customer-form";
import { formatDate } from "@/utils/formatters";
import type { Customer } from "@/types";

interface CustomerTableProps {
  customers: Customer[];
}

export function CustomerTable({ customers }: CustomerTableProps) {
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    const result = await deleteCustomer(id);
    if (result.success) {
      toast.success("Customer deleted");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {customer.phone}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(customer.createdAt)}
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
                    <CustomerForm
                      customer={customer}
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
                      onClick={() => handleDelete(customer.id)}
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
