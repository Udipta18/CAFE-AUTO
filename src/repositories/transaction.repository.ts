import { supabase } from "@/lib/supabase";

interface TransactionRow {
  id: string;
  customer_id: string;
  item_id: string;
  quantity: number;
  amount: string | number;
  invoice_id?: string | null;
  created_at: string | Date;
  customers?: { name: string; phone?: string | null } | { name: string; phone?: string | null }[] | null;
  items?: { name: string } | { name: string }[] | null;
  invoices?: { status: string; token: string } | { status: string; token: string }[] | null;
}

function mapTransaction(row: TransactionRow) {
  const customer = Array.isArray(row.customers) ? row.customers[0] : row.customers;
  const item = Array.isArray(row.items) ? row.items[0] : row.items;
  const invoice = Array.isArray(row.invoices) ? row.invoices[0] : row.invoices;
  return {
    id: row.id,
    customerId: row.customer_id,
    itemId: row.item_id,
    quantity: row.quantity,
    amount: row.amount.toString(),
    invoiceId: row.invoice_id ?? null,
    invoiceStatus: invoice?.status ?? null,
    invoiceToken: invoice?.token ?? null,
    createdAt: new Date(row.created_at),
    customerName: customer?.name ?? null,
    customerPhone: customer?.phone ?? null,
    itemName: item?.name ?? null,
  };
}

export const TransactionRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id,
        customer_id,
        item_id,
        quantity,
        amount,
        invoice_id,
        created_at,
        customers (
          name,
          phone
        ),
        items (
          name
        ),
        invoices (
          status,
          token
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapTransaction);
  },

  async findByCustomerId(customerId: string) {
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id,
        customer_id,
        item_id,
        quantity,
        amount,
        invoice_id,
        created_at,
        customers (
          name,
          phone
        ),
        items (
          name
        ),
        invoices (
          status,
          token
        )
      `)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapTransaction);
  },

  async findUnbilled(customerId: string) {
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id,
        customer_id,
        item_id,
        quantity,
        amount,
        invoice_id,
        created_at,
        customers (
          name,
          phone
        ),
        items (
          name
        )
      `)
      .eq("customer_id", customerId)
      .is("invoice_id", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapTransaction);
  },

  async findAllUnbilled() {
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id,
        customer_id,
        item_id,
        quantity,
        amount,
        invoice_id,
        created_at,
        customers (
          name,
          phone
        ),
        items (
          name
        )
      `)
      .is("invoice_id", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapTransaction);
  },

  async create(data: {
    customerId: string;
    itemId: string;
    quantity: number;
    amount: string;
  }) {
    const { data: created, error } = await supabase
      .from("transactions")
      .insert({
        customer_id: data.customerId,
        item_id: data.itemId,
        quantity: data.quantity,
        amount: data.amount,
      })
      .select()
      .single();

    if (error) throw error;
    return mapTransaction(created);
  },

  async bulkUpdateInvoiceId(transactionIds: string[], invoiceId: string) {
    const { error } = await supabase
      .from("transactions")
      .update({ invoice_id: invoiceId })
      .in("id", transactionIds);

    if (error) throw error;
  },

  async getRecent(limit: number = 10) {
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id,
        customer_id,
        item_id,
        quantity,
        amount,
        created_at,
        customers (
          name,
          phone
        ),
        items (
          name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map(mapTransaction);
  },
};
