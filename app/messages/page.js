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
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
          <p className="text-sm text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Inbox</h1>

      {conversations.length === 0 ? (
        <p className="text-gray-500">You don’t have any conversations yet.</p>
      ) : (
        <div className="space-y-3">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/messages/${c.id}`}
              className="flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition relative"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-700">
                {c.otherUserName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>

              {/* Message Preview */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-900 truncate">
                    {c.otherUserName}
                  </p>
                  <p className="text-xs text-gray-400 ml-2">
                    {new Date(c.lastMessageTime).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {c.lastMessage}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{c.listingTitle}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
