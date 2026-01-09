"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setLoading(true);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setNotifications(data || []);
    }

    setLoading(false);
  }

  async function markAsRead(id) {
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
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {loading && (
        <p className="text-gray-500">Loading notifications…</p>
      )}

      {!loading && notifications.length === 0 && (
        <p className="text-gray-500">
          You don’t have any notifications yet.
        </p>
      )}

      <div className="space-y-4">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`border rounded-lg p-4 flex justify-between items-start ${
              notification.read
                ? "bg-white"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <div>
              <p className="font-medium">
                {notification.title}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(notification.created_at).toLocaleString()}
              </p>
            </div>

            {!notification.read && (
              <button
                onClick={() => markAsRead(notification.id)}
                className="text-sm text-black font-medium hover:underline"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
