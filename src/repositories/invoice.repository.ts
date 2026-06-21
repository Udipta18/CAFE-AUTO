import { supabase } from "@/lib/supabase";
import type { InvoiceStatus } from "@/types";

interface InvoiceRow {
  id: string;
  token: string;
  customer_id: string;
  total: string | number;
  status: InvoiceStatus;
  approved_at: string | Date | null;
  paid_at: string | Date | null;
  created_at: string | Date;
  customers?: { name: string; phone: string } | { name: string; phone: string }[] | null;
}

function mapInvoice(row: InvoiceRow) {
  const customer = Array.isArray(row.customers) ? row.customers[0] : row.customers;
  return {
    id: row.id,
    token: row.token,
    customerId: row.customer_id,
    total: row.total.toString(),
    status: row.status,
    approvedAt: row.approved_at ? new Date(row.approved_at) : null,
    paidAt: row.paid_at ? new Date(row.paid_at) : null,
    createdAt: new Date(row.created_at),
    customerName: customer?.name ?? null,
    customerPhone: customer?.phone ?? null,
  };
}

interface InvoiceItemRow {
  id: string;
  invoice_id: string;
  item_name: string;
  quantity: number;
  amount: string | number;
}

function mapInvoiceItem(row: InvoiceItemRow) {
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    itemName: row.item_name,
    quantity: row.quantity,
    amount: row.amount.toString(),
  };
}

export const InvoiceRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        id,
        token,
        customer_id,
        total,
        status,
        approved_at,
        paid_at,
        created_at,
        customers (
          name,
          phone
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapInvoice);
  },

  async findByStatus(status: InvoiceStatus) {
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        id,
        token,
        customer_id,
        total,
        status,
        approved_at,
        paid_at,
        created_at,
        customers (
          name,
          phone
        )
      `)
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapInvoice);
  },

  async findByToken(token: string) {
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        id,
        token,
        customer_id,
        total,
        status,
        approved_at,
        paid_at,
        created_at,
        customers (
          name,
          phone
        )
      `)
      .eq("token", token)
      .maybeSingle();

    if (error) throw error;
    return data ? mapInvoice(data) : null;
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        id,
        token,
        customer_id,
        total,
        status,
        approved_at,
        paid_at,
        created_at,
        customers (
          name,
          phone
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapInvoice(data) : null;
  },

  async create(data: {
    token: string;
    customerId: string;
    total: string;
    status: InvoiceStatus;
  }) {
    const { data: created, error } = await supabase
      .from("invoices")
      .insert({
        token: data.token,
        customer_id: data.customerId,
        total: data.total,
        status: data.status,
      })
      .select()
      .single();

    if (error) throw error;
    return mapInvoice(created);
  },

  async updateStatus(
    id: string,
    status: InvoiceStatus,
    timestamps: { approvedAt?: Date; paidAt?: Date } = {}
  ) {
    const updateData: { status: InvoiceStatus; approved_at?: string; paid_at?: string } = { status };
    if (timestamps.approvedAt) updateData.approved_at = timestamps.approvedAt.toISOString();
    if (timestamps.paidAt) updateData.paid_at = timestamps.paidAt.toISOString();

    const { data: updated, error } = await supabase
      .from("invoices")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapInvoice(updated);
  },

  async createItems(
    items: {
      invoiceId: string;
      itemName: string;
      quantity: number;
      amount: string;
    }[]
  ) {
    if (items.length === 0) return [];

    const itemsToInsert = items.map((item) => ({
      invoice_id: item.invoiceId,
      item_name: item.itemName,
      quantity: item.quantity,
      amount: item.amount,
    }));

    const { data, error } = await supabase
      .from("invoice_items")
      .insert(itemsToInsert)
      .select();

    if (error) throw error;
    return (data || []).map(mapInvoiceItem);
  },

  async getItemsByInvoiceId(invoiceId: string) {
    const { data, error } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoiceId);

    if (error) throw error;
    return (data || []).map(mapInvoiceItem);
  },

  async count() {
    const { count, error } = await supabase
      .from("invoices")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count ?? 0;
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        id,
        token,
        customer_id,
        total,
        status,
        approved_at,
        paid_at,
        created_at,
        customers!inner (
          name,
          phone
        )
      `)
      .ilike("customers.name", `%${query}%`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapInvoice);
  },
};
