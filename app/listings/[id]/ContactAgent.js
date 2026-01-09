"use client";

import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";

export default function ContactAgent({ listingId, agentId }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const supabase = getSupabaseClient();

  async function contactAgent() {
    if (loading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const buyerId = user.id;

    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("listing_id", listingId)
      .eq("buyer_id", buyerId)
      .maybeSingle();

    let conversationId = existing?.id;

    if (!conversationId) {
      const { data: created } = await supabase
        .from("conversations")
        .insert({
          listing_id: listingId,
          buyer_id: buyerId,
          agent_id: agentId
        })
        .select("id")
        .single();

      conversationId = created.id;
    }

    router.push(`/messages/${conversationId}`);
  }

  return (
    <>
      <h3 className="text-lg font-semibold mb-2">
        Interested in this property?
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        Contact the agent to schedule an inspection or ask questions.
      </p>

      <button
        onClick={contactAgent}
        className="w-full bg-black text-white py-3 rounded font-medium"
      >
        Contact Agent
      </button>
    </>
  );
}
