"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function ChatClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const conversationId = searchParams.get("id");

  const supabase = getSupabaseClient();
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    init();
    return () => supabase.removeAllChannels();
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
    await loadMessages(session.user.id);
    subscribe(session.user.id);
  }

  async function loadMessages(uid) {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
    scrollBottom();

    await supabase
      .from("messages")
      .update({ read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", uid);
  }

  function subscribe(uid) {
    supabase
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollBottom();

          if (payload.new.sender_id !== uid) {
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

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: userId,
      body: text,
    });

    setText("");
  }

  function scrollBottom() {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col border rounded-xl bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const mine = m.sender_id === userId;
          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
                  mine
                    ? "bg-black text-white rounded-br-none"
                    : "bg-gray-100 rounded-bl-none"
                }`}
              >
                {m.body}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="border-t p-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-3 py-2 text-sm"
          placeholder="Type a message…"
        />
        <button className="bg-black text-white px-5 rounded text-sm">
          Send
        </button>
      </form>
    </div>
  );
}
