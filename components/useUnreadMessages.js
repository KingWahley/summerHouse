"use client";

import { useEffect, useState } from "react";
import { fetchUnreadCount } from "@/lib/unreadMessages";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";

export function useUnreadMessages() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const supabase = getSupabaseClient();

    fetchUnreadCount(user.id).then(setCount);

    const channel = supabase
      .channel(`unread-messages-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=neq.${user.id}`,
        },
        () => {
          fetchUnreadCount(user.id).then(setCount);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchUnreadCount(user.id).then(setCount);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return count;
}
