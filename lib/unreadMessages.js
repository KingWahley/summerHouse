import { getSupabaseClient } from "./supabaseClient";

export async function fetchUnreadCount(userId) {
  const supabase = getSupabaseClient();

  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("read", false)
    .neq("sender_id", userId)
    .or(
      `conversation_id.in.(select id from conversations where buyer_id.eq.${userId} or agent_id.eq.${userId})`
    );

  return count || 0;
}
