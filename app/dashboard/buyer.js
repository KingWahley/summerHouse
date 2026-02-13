"use client";

import { useEffect, useMemo, useState } from "react";
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
  }, [loading, user, role, router]);

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

  const stats = useMemo(() => {
    return [
      {
        label: "Saved Properties",
        value: saved.length,
        href: "/saved",
        helper: "Shortlist your favorites"
      },
      {
        label: "Inspection Requests",
        value: bookings.length,
        href: "/bookings",
        helper: "Track upcoming visits"
      },
      {
        label: "Unread Messages",
        value: unreadMessages,
        href: "/messages",
        helper: "Stay on top of replies"
      }
    ];
  }, [saved.length, bookings.length, unreadMessages]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-shell min-h-screen bg-gradient-to-b from-[#f8f4eb] via-[#f6f6f2] to-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Buyer Dashboard
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 mt-3">
              Find your next place with confidence.
            </h1>
            <p className="text-base text-slate-600 mt-4">
              Keep your saved homes, inspection requests, and conversations in
              one calm, organized space.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/listings"
              className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-medium shadow-sm hover:bg-slate-800 transition"
            >
              Browse listings
            </Link>
            <Link
              href="/messages"
              className="rounded-full border border-slate-300 bg-white/70 px-5 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 transition"
            >
              Open inbox
            </Link>
          </div>
        </header>

        <div className="grid gap-4 mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <QuickCard key={stat.label} {...stat} />
          ))}
        </div>

        {saved.length === 0 && bookings.length === 0 && unreadMessages === 0 && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white/80 p-6 text-center shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Nothing yet
            </p>
            <h2 className="text-2xl font-semibold text-slate-900 mt-3">
              Your dashboard is empty.
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Start browsing listings to save homes, book inspections, and
              message agents.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/listings"
                className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-medium shadow-sm hover:bg-slate-800 transition"
              >
                Explore listings
              </Link>
              <Link
                href="/messages"
                className="rounded-full border border-slate-300 bg-white/70 px-5 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 transition"
              >
                View messages
              </Link>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 mt-10">
          <Section
            title="Recently Saved"
            href="/saved"
            emptyText="You have not saved any properties yet."
          >
            {saved.map((item) => (
              <div
                key={item.listing_id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
              >
                <div>
                  <p className="font-medium text-slate-900 truncate">
                    {item.listings?.title}
                  </p>
                  <p className="text-sm text-slate-500">
                    NGN {Number(item.listings?.price).toLocaleString()}
                  </p>
                </div>

                <Link
                  href={`/listings/${item.listing_id}`}
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900"
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
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4"
              >
                <div>
                  <p className="font-medium text-slate-900 truncate">
                    {booking.listings?.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                </div>

                <StatusBadge status={booking.status} />
              </div>
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
}

function QuickCard({ label, value, href, helper }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-slate-300"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="text-3xl font-semibold text-slate-900 mt-3">{value}</p>
      <p className="text-sm text-slate-500 mt-2">{helper}</p>
      <div className="mt-5 text-sm font-medium text-slate-700 group-hover:text-slate-900">
        View details
      </div>
    </Link>
  );
}

function Section({ title, href, emptyText, children }) {
  const hasItems = useMemo(() => children && children.length > 0, [children]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <Link
          href={href}
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          View all
        </Link>
      </div>

      {hasItems ? (
        <div className="space-y-4">{children}</div>
      ) : (
        <p className="text-sm text-slate-500">{emptyText}</p>
      )}
    </section>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700"
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}
