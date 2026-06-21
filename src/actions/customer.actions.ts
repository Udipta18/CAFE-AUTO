"use server";

import { revalidatePath } from "next/cache";
import { CustomerService } from "@/services/customer.service";
import type { CreateCustomerInput, UpdateCustomerInput } from "@/types";

export async function createCustomer(input: CreateCustomerInput) {
  try {
    const customer = await CustomerService.create(input);
    revalidatePath("/dashboard/customers");
    return { success: true, data: customer };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create customer";
    return { success: false, error: message };
  }
}

export async function updateCustomer(input: UpdateCustomerInput) {
  try {
    const customer = await CustomerService.update(input);
    revalidatePath("/dashboard/customers");
    return { success: true, data: customer };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update customer";
    return { success: false, error: message };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await CustomerService.remove(id);
    revalidatePath("/dashboard/customers");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete customer";
    return { success: false, error: message };
  }
}
