"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversation");
  const supabase = getSupabaseClient();


  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function init() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user || !conversationId) return;

    setUser(user);
    await fetchMessages(conversationId);
    setLoading(false);
  }

  async function fetchMessages(conversationId) {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const payload = {
      conversation_id: conversationId,
      sender_id: user.id,
      content: text
    };

    const { error } = await supabase
      .from("messages")
      .insert(payload);

    if (!error) {
      setMessages(prev => [
        ...prev,
        { ...payload, created_at: new Date() }
      ]);
      setText("");
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-gray-500">
        Loading chat…
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="p-10 text-gray-500">
        No conversation selected.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 h-[80vh] flex flex-col">
      {/* Header */}
      <div className="border-b pb-4 mb-4">
        <h1 className="text-xl font-semibold">Conversation</h1>
        <p className="text-sm text-gray-500">
          Secure in-app messaging
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${
              msg.sender_id === user.id
                ? "bg-black text-white ml-auto"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="border-t pt-4 mt-4 flex gap-3"
      >
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type your message…"
          className="flex-1 border rounded-md px-3 py-2"
        />
        <button
          type="submit"
          className="bg-black text-white px-5 py-2 rounded-md"
        >
          Send
        </button>
      </form>
    </div>
  );
}
