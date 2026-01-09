"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    const supabase = getSupabaseClient();
    setLoading(true);

    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("notifications")
      .select(`
        id,
        title,
        message,
        read,
        created_at,
        listing:listing_id (
          id,
          title
        ),
        conversation_id
      `)
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setNotifications(data || []);
    }

    setLoading(false);
  }

  async function markAsRead(id) {
    const supabase = getSupabaseClient();

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Notifications
      </h1>

      {loading && (
        <p className="text-gray-500">Loading notifications…</p>
      )}

      {!loading && notifications.length === 0 && (
        <p className="text-gray-500">
          You don’t have any notifications yet.
        </p>
      )}

      <div className="space-y-4">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`border rounded-lg p-4 ${
              n.read ? "bg-white" : "bg-gray-100 border-gray-300"
            }`}
          >
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-medium">{n.title}</p>

                <p className="text-sm text-gray-600 mt-1">
                  {n.message}
                </p>

                {n.listing && (
                  <p className="text-xs text-gray-500 mt-2">
                    Property:{" "}
                    <Link
                      href={`/listings/${n.listing.id}`}
                      className="underline"
                    >
                      {n.listing.title}
                    </Link>
                  </p>
                )}

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Link
                  href={`/messages/${n.conversation_id}`}
                  className="text-sm font-medium text-black underline"
                >
                  View message
                </Link>

                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-xs text-gray-600 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
