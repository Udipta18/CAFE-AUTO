import { supabase } from "@/lib/supabase";
import type { CreateItemInput, UpdateItemInput } from "@/types";

interface ItemRow {
  id: string;
  name: string;
  price: string | number;
  active: boolean;
  created_at: string | Date;
}

function mapItem(row: ItemRow) {
  return {
    id: row.id,
    name: row.name,
    price: row.price.toString(),
    active: row.active,
    createdAt: new Date(row.created_at),
  };
}

export const ItemRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapItem);
  },

  async findActive() {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("active", true)
      .order("name", { ascending: true });

    if (error) throw error;
    return (data || []).map(mapItem);
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapItem(data) : null;
  },

  async create(data: CreateItemInput) {
    const { data: created, error } = await supabase
      .from("items")
      .insert({ ...data, active: true })
      .select()
      .single();

    if (error) throw error;
    return mapItem(created);
  },

  async update({ id, ...data }: UpdateItemInput) {
    const { data: updated, error } = await supabase
      .from("items")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapItem(updated);
  },

  async remove(id: string) {
    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
