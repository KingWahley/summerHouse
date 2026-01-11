"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function BuyerDashboard() {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  const [saved, setSaved] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (role !== "buyer") {
      router.replace("/dashboard");
      return;
    }

    fetchAll();
  }, [loading, user, role]);

  async function fetchAll() {
    const supabase = getSupabaseClient();

    await Promise.all([
      fetchSaved(supabase),
      fetchBookings(supabase),
      fetchUnreadMessages(supabase)
    ]);

    setDataLoading(false);
  }

  async function fetchSaved(supabase) {
    const { data } = await supabase
      .from("saved_listings")
      .select("listing_id, listings(id, title, price)")
      .eq("user_id", user.id)
      .limit(5);

    setSaved(data || []);
  }

  async function fetchBookings(supabase) {
    const { data } = await supabase
      .from("inspection_requests")
      .select("id, status, date, listings(title)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setBookings(data || []);
  }

  async function fetchUnreadMessages(supabase) {
    const { count } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("read", false)
      .neq("sender_id", user.id);

    setUnreadMessages(count || 0);
  }

  if (loading || dataLoading) {
    return (
      <div className="p-10 text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">
        Buyer Dashboard
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <QuickCard
          title="Saved Properties"
          value={saved.length}
          href="/saved"
        />
        <QuickCard
          title="Inspection Requests"
          value={bookings.length}
          href="/bookings"
        />
        <QuickCard
          title="Unread Messages"
          value={unreadMessages}
          href="/messages"
        />
      </div>

      <Section
        title="Recently Saved"
        href="/saved"
        emptyText="You haven’t saved any properties yet."
      >
        {saved.map(item => (
          <div
            key={item.listing_id}
            className="flex justify-between items-center border rounded-lg p-4"
          >
            <div>
              <p className="font-medium truncate">
                {item.listings?.title}
              </p>
              <p className="text-sm text-gray-500">
                ₦{Number(item.listings?.price).toLocaleString()}
              </p>
            </div>

            <Link
              href={`/listings/${item.listing_id}`}
              className="text-sm font-medium hover:underline"
            >
              View
            </Link>
          </div>
        ))}
      </Section>

      <Section
        title="Inspection Requests"
        href="/bookings"
        emptyText="No inspection requests yet."
      >
        {bookings.map(b => (
          <div
            key={b.id}
            className="flex justify-between items-center border rounded-lg p-4"
          >
            <div>
              <p className="font-medium truncate">
                {b.listings?.title}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(b.date).toLocaleDateString()}
              </p>
            </div>

            <StatusBadge status={b.status} />
          </div>
        ))}
      </Section>
    </div>
  );
}


function QuickCard({ title, value, href }) {
  return (
    <Link
      href={href}
      className="bg-white border rounded-xl p-6 hover:shadow-sm transition"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </Link>
  );
}

function Section({ title, href, emptyText, children }) {
  return (
    <div className="bg-white border rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <Link
          href={href}
          className="text-sm font-medium hover:underline"
        >
          View all
        </Link>
      </div>

      {children.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyText}</p>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700"
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-md font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
