"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function InboxPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [conversations, setConversations] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      router.replace("/auth/login");
      return;
    }

    setUserId(session.user.id);
    await fetchConversations(session.user.id);
    setLoading(false);
  }

  async function fetchConversations(uid) {
    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
    id,
    created_at,
    listing:listing_id (
      id,
      title
    ),
    buyer_id,
    agent_id,
    buyer:buyer_id (
      id,
      full_name
    ),
    agent:agent_id (
      id,
      full_name
    ),
    messages (
      body,
      created_at
    )
  `
      )
      .or(`buyer_id.eq.${uid},agent_id.eq.${uid}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error.message);
      setConversations([]);
      return;
    }

    // Sort messages and extract last message
    const formatted = data.map((c) => {
      const sortedMessages = [...(c.messages || [])].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      const lastMessage = sortedMessages[0];

      const isBuyer = c.buyer_id === uid;

      const otherUser = isBuyer
        ? c.agent || { full_name: "Agent" }
        : c.buyer || { full_name: "Buyer" };

      return {
        id: c.id,
        listingTitle: c.listing?.title || "Property",
        otherUserName: otherUser.full_name,
        lastMessage: lastMessage?.body || "No messages yet",
        lastMessageTime: lastMessage?.created_at || c.created_at,
      };
    });

    setConversations(formatted);
  }

  if (loading) {
    return <div className="p-10 text-gray-500">Loading inbox…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <p className="text-gray-500">You don’t have any conversations yet.</p>
      ) : (
        <div className="space-y-4">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/messages/${c.id}`}
              className="block border rounded-xl p-4 bg-white hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold">{c.listingTitle}</p>

                  <p className="text-sm text-gray-600 mt-1">
                    With {c.otherUserName}
                  </p>

                  <p className="text-sm text-gray-500 mt-2 line-clamp-1">
                    {c.lastMessage}
                  </p>
                </div>

                <div className="text-xs text-gray-400">
                  {new Date(c.lastMessageTime).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
