"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { ROLES } from "@/lib/roles";

export default function ListingModeration() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const supabase = getSupabaseClient();

    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session?.user) {
      router.replace("/auth/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();

    if (profile?.role !== ROLES.ADMIN) {
      router.replace("/dashboard");
      return;
    }

    await fetchPendingListings();
    setLoading(false);
  }

  async function fetchPendingListings() {
    const supabase = getSupabaseClient();

    const { data } = await supabase
      .from("listings")
      .select(
        `
        id,
        title,
        price,
        location,
        owner_id,
        created_at,
        profiles ( full_name )
      `
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    setListings(data || []);
  }

  async function updateStatus(id, status) {
    setActionLoading(id);

    const supabase = getSupabaseClient();

    await supabase
      .from("listings")
      .update({ status })
      .eq("id", id);

    setListings(prev => prev.filter(l => l.id !== id));
    setActionLoading(null);
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Loading moderation queue…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">
        Listing Moderation
      </h1>
      <p className="text-gray-500 mb-8">
        Review and approve submitted property listings
      </p>

      {listings.length === 0 && (
        <p className="text-gray-500">
          No listings awaiting moderation.
        </p>
      )}

      <div className="space-y-4">
        {listings.map(listing => (
          <div
            key={listing.id}
            className="bg-white border rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h3 className="font-semibold text-lg">
                {listing.title}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {listing.location || "Location not specified"}
              </p>

              <p className="text-sm mt-2">
                ₦{Number(listing.price).toLocaleString()}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                Submitted by{" "}
                {listing.profiles?.full_name || "Unknown"} ·{" "}
                {new Date(listing.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => updateStatus(listing.id, "active")}
                disabled={actionLoading === listing.id}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium disabled:opacity-60"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(listing.id, "rejected")}
                disabled={actionLoading === listing.id}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
