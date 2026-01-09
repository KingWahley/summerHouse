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

  useEffect(() => {
    if (loading) return;

    // 🔒 Auth guard
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (!["agent", "owner", "admin"].includes(role)) {
      router.replace("/dashboard");
      return;
    }

    fetchListings();
    // eslint-disable-next-line
  }, [loading, user, role]);

  async function fetchListings() {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("listings")
      .select("id, title, price, type, status, created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setListings(data || []);
    } else {
      console.error(error.message);
      setListings([]);
    }

    setDataLoading(false);
  }

  if (loading || dataLoading) {
    return (
      <div className="p-10 text-gray-500">
        Loading agent dashboard…
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        Agent / Owner Dashboard
      </h1>
      <p className="text-gray-500 mb-8">
        Manage your property listings
      </p>

      {/* Listings */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          My Listings
        </h2>

        {listings.length === 0 ? (
          <p className="text-gray-500">
            You haven’t listed any properties yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <div
                key={listing.id}
                className="bg-white border rounded-xl p-5"
              >
                <h3 className="font-semibold text-lg">
                  {listing.title}
                </h3>

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
                    {new Date(
                      listing.created_at
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
