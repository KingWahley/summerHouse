
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

  /* ---------- LOAD + SUBSCRIBE ---------- */
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
    // eslint-disable-next-line
  }, [authLoading, user, id]);

  /* ---------- LOAD HISTORY ---------- */
  async function loadMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    setMessages(data || []);
    scrollToBottom();

    // mark incoming as read
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("conversation_id", id)
      .neq("sender_id", user.id);
  }

  /* ---------- REALTIME ---------- */
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

          // auto-read if incoming
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

  /* ---------- SEND ---------- */
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
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ---------- UI ---------- */
  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col border rounded-xl bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const mine = m.sender_id === user.id;

          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
                  mine
                    ? "bg-black text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {m.body}
                <div className="text-[10px] opacity-70 mt-1 text-right">
                  {new Date(m.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="border-t p-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-3 py-2 text-sm"
          placeholder="Type a message…"
        />
        <button
          type="submit"
          className="bg-black text-white px-5 rounded text-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
}
