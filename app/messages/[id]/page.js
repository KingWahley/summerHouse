"use client";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = getSupabaseClient();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    loadMessages();
    const channel = subscribeToMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authLoading, user, id]);

  async function loadMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    setMessages(data || []);
    setTimeout(() => scrollToBottom(), 100); // ensure auto-scroll after render

    await supabase
      .from("messages")
      .update({ read: true })
      .eq("conversation_id", id)
      .neq("sender_id", user.id);
  }

  function subscribeToMessages() {
    return supabase
      .channel(`messages:${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom();

          if (payload.new.sender_id !== user.id) {
            supabase
              .from("messages")
              .update({ read: true })
              .eq("id", payload.new.id);
          }
        }
      )
      .subscribe();
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: id,
      sender_id: user.id,
      body: text,
    });

    if (!error) {
      setText("");
    }
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col bg-gray-50 border rounded-xl shadow">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {messages.map((m) => {
          const mine = m.sender_id === user.id;

          return (
            <div
              key={m.id}
              className={`flex items-end ${mine ? "justify-end" : "justify-start"}`}
            >
              {!mine && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 mr-2">
                  {/* First letter as avatar */}
                  {m.sender_name?.[0] || "U"}
                </div>
              )}

              <div
                className={`max-w-[70%] px-4 py-2 text-sm rounded-2xl relative ${
                  mine
                    ? "bg-gradient-to-br from-black to-gray-800 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                }`}
              >
                {m.body}

                <div className="text-[10px] opacity-50 mt-1 text-right">
                  {new Date(m.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {mine && (
                <div className="flex-shrink-0 w-2" /> // spacing
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input box */}
      <form onSubmit={sendMessage} className="p-3 flex gap-2 border-t bg-white">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="Type a message…"
        />
        <button
          type="submit"
          className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-900 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
