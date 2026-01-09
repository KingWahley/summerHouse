"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Messages() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    setUser(user);
    fetchConversations(user.id);
  }

  async function fetchConversations(userId) {
    const { data } = await supabase
      .from("conversations")
      .select("id, updated_at")
      .or(`buyer_id.eq.${userId},agent_id.eq.${userId}`)
      .order("updated_at", { ascending: false });

    setConversations(data || []);
  }

  async function openConversation(convo) {
    setActiveConversation(convo);

    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convo.id)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!text || !activeConversation) return;

    const payload = {
      conversation_id: activeConversation.id,
      sender_id: user.id,
      content: text
    };

    await supabase.from("messages").insert(payload);

    setMessages(prev => [...prev, { ...payload, created_at: new Date() }]);
    setText("");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 h-[80vh]">
      {/* Conversations */}
      <div className="border rounded-lg overflow-y-auto">
        <div className="p-4 font-semibold border-b">
          Conversations
        </div>

        {conversations.length === 0 && (
          <p className="p-4 text-sm text-gray-500">
            No conversations yet.
          </p>
        )}

        {conversations.map(convo => (
          <button
            key={convo.id}
            onClick={() => openConversation(convo)}
            className={`w-full text-left p-4 border-b hover:bg-gray-50 ${
              activeConversation?.id === convo.id
                ? "bg-gray-100"
                : ""
            }`}
          >
            <p className="text-sm font-medium">
              Conversation #{convo.id.slice(0, 6)}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(convo.updated_at).toLocaleString()}
            </p>
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="md:col-span-2 border rounded-lg flex flex-col">
        {!activeConversation ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation
          </div>
        ) : (
          <>
            <div className="p-4 border-b font-semibold">
              Chat
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[70%] p-3 rounded-lg text-sm ${
                    msg.sender_id === user.id
                      ? "bg-black text-white ml-auto"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            <form
              onSubmit={sendMessage}
              className="p-4 border-t flex gap-3"
            >
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 border rounded-md px-3 py-2"
              />
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-md"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
