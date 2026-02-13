"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function AgentDashboard() {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  const [listings, setListings] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (!["agent", "owner", "admin"].includes(role)) {
      router.replace("/dashboard");
      return;
    }

    fetchListings();
  }, [loading, user, role, router]);

  async function fetchListings() {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("listings")
      .select("id, title, price, type, status, created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error.message);
      setListings([]);
    } else {
      setListings(data || []);
    }

    setDataLoading(false);
  }

  async function handleDelete(listingId) {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    setDeletingId(listingId);

    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", listingId)
      .eq("owner_id", user.id);

    if (error) {
      alert("Failed to delete listing");
      console.error(error.message);
    } else {
      setListings((prev) => prev.filter((listing) => listing.id !== listingId));
    }

    setDeletingId(null);
  }

  const summary = useMemo(() => {
    const active = listings.filter((listing) => listing.status === "active")
      .length;
    const pending = listings.filter((listing) => listing.status === "pending")
      .length;
    const inactive = listings.filter(
      (listing) => listing.status !== "active" && listing.status !== "pending"
    ).length;

    return [
      {
        label: "Total Listings",
        value: listings.length,
        helper: "Across all property types"
      },
      {
        label: "Active",
        value: active,
        helper: "Visible to buyers"
      },
      {
        label: "Pending",
        value: pending,
        helper: "Awaiting review"
      },
      {
        label: "Inactive",
        value: inactive,
        helper: "Hidden or archived"
      }
    ];
  }, [listings]);

  if (loading || dataLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
          <p className="text-sm text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell min-h-screen bg-gradient-to-b from-[#f5f3ea] via-[#f3f6f4] to-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Agent Dashboard
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 mt-3">
              Welcome back, {user.email}.
            </h1>
            <p className="text-base text-slate-600 mt-4 max-w-2xl">
              Publish, update, and monitor your listings with a clear overview
              of performance and status.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/listings/create"
              className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-medium shadow-sm hover:bg-slate-800 transition"
            >
              New listing
            </Link>
            <Link
              href="/messages"
              className="rounded-full border border-slate-300 bg-white/70 px-5 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 transition"
            >
              Messages
            </Link>
          </div>
        </header>

        <div className="grid gap-4 mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {summary.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {item.label}
              </p>
              <p className="text-3xl font-semibold text-slate-900 mt-3">
                {item.value}
              </p>
              <p className="text-sm text-slate-500 mt-2">{item.helper}</p>
            </div>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Your Listings
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Sorted by most recently created.
              </p>
            </div>
            <Link
              href="/listings/create"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Create another listing
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-slate-600">
                You have not listed any properties yet.
              </p>
              <Link
                href="/listings/create"
                className="inline-flex mt-4 rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-medium hover:bg-slate-800 transition"
              >
                Create your first listing
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-lg text-slate-900 truncate">
                        {listing.title}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {new Date(listing.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 capitalize mt-2">
                      {listing.type}
                    </p>

                    <p className="text-sm mt-2 font-semibold text-slate-900">
                      NGN {Number(listing.price).toLocaleString()}
                    </p>

                    <div className="mt-4">
                      <StatusPill status={listing.status} />
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => router.push(`/listings/${listing.id}/edit`)}
                      className="flex-1 rounded-full border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(listing.id)}
                      disabled={deletingId === listing.id}
                      className="flex-1 rounded-full bg-rose-600 text-white py-2 text-sm font-medium hover:bg-rose-700 disabled:opacity-60"
                    >
                      {deletingId === listing.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const styles = {
    active: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    rejected: "bg-rose-100 text-rose-700"
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}
