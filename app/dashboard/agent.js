"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  }, [loading, user, role]);

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

  if (loading || dataLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
          <p className="text-sm text-gray-600">loading Dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Hello {user.email}</h1>
      <p className="text-gray-500 mb-8">Manage your property listings</p>

      <section>
        <h2 className="text-xl font-semibold mb-4">My Listings</h2>

        {listings.length === 0 ? (
          <p className="text-gray-500">
            You haven’t listed any properties yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white border rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg">{listing.title}</h3>

                  <p className="text-sm text-gray-500 capitalize mt-1">
                    {listing.type}
                  </p>

                  <p className="text-sm mt-2 font-medium">
                    ₦{Number(listing.price).toLocaleString()}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        listing.status === "active"
                          ? "bg-green-100 text-green-700"
                          : listing.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {listing.status}
                    </span>

                    <span className="text-xs text-gray-400">
                      {new Date(listing.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => router.push(`/listings/${listing.id}/edit`)}
                    className="flex-1 border rounded-md py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(listing.id)}
                    disabled={deletingId === listing.id}
                    className="flex-1 bg-red-500 text-white rounded-md py-2 text-sm font-medium hover:bg-red-600 disabled:opacity-60"
                  >
                    {deletingId === listing.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
