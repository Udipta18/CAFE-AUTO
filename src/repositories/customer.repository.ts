import { supabase } from "@/lib/supabase";
import type { CreateCustomerInput, UpdateCustomerInput } from "@/types";

interface CustomerRow {
  id: string;
  name: string;
  phone: string;
  created_at: string | Date;
}

function mapCustomer(row: CustomerRow) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    createdAt: new Date(row.created_at),
  };
}

export const CustomerRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapCustomer);
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapCustomer(data) : null;
  },

  async create(data: CreateCustomerInput) {
    const { data: created, error } = await supabase
      .from("customers")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return mapCustomer(created);
  },

  async update({ id, ...data }: UpdateCustomerInput) {
    const { data: updated, error } = await supabase
      .from("customers")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapCustomer(updated);
  },

  async remove(id: string) {
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .ilike("name", `%${query}%`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapCustomer);
  },

  async count() {
    const { count, error } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count ?? 0;
  },
};
