import { supabase } from "@/shared";
import type { Product } from "../model/types";

export const fetchProducts = async (category?: string): Promise<Product[]> => {
  let query = supabase.from("products").select("*");

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const fetchProduct = async (id: number): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};
