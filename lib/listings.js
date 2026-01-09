import { getSupabaseClient } from "./supabaseClient";

export async function fetchPublicListings({ query, filters }) {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  let q = supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (query) {
    q = q.or(
      `title.ilike.%${query}%,description.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%`
    );
  }

  if (filters.type) q = q.eq("type", filters.type);
  if (filters.minPrice) q = q.gte("price", filters.minPrice);
  if (filters.maxPrice) q = q.lte("price", filters.maxPrice);

  const { data } = await q.limit(24);
  return data || [];
}
