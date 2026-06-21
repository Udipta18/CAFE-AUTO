import { z } from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone must be at most 15 digits")
    .regex(/^[0-9+\-\s]+$/, "Invalid phone format"),
});

export const itemSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    }),
});

export const transactionSchema = z.object({
  customerId: z.string().uuid("Invalid customer"),
  itemId: z.string().uuid("Invalid item"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const tokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const invoiceIdSchema = z.object({
  invoiceId: z.string().uuid("Invalid invoice ID"),
});

export const generateInvoiceSchema = z.object({
  customerId: z.string().uuid("Invalid customer"),
});
