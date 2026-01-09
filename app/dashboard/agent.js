"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "../../lib/supabaseClient";

export default function AgentDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    let active = true;

    async function load() {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      // 1️⃣ Check session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/auth/login");
        return;
      }

      // 2️⃣ Fetch agent listings
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, price, type, status, created_at")
        .eq("owner_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        console.error(error.message);
        setListings([]);
      } else {
        setListings(data || []);
      }

      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [router]);

  if (loading) {
    return <div className="p-10 text-gray-500">Loading agent dashboard…</div>;
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Agent / Owner Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your property listings</p>

      {/* Listings */}
      <section>
        <h2 className="text-xl font-semibold mb-4">My Listings</h2>

        {listings.length === 0 ? (
          <p className="text-gray-500">
            You haven’t listed any properties yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white border rounded-xl p-5">
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
