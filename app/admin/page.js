"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { ROLES } from "@/lib/roles";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);

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

    await fetchListings();
    setLoading(false);
  }

  async function fetchListings() {
    const supabase = getSupabaseClient();

    const { data } = await supabase
      .from("listings")
      .select("id, title, price, type, created_at")
      .order("created_at", { ascending: false });

    setListings(data || []);
  }

  async function deleteListing(id) {
    if (!confirm("Delete this listing permanently?")) return;

    const supabase = getSupabaseClient();

    await supabase.from("listings").delete().eq("id", id);
    setListings(prev => prev.filter(l => l.id !== id));
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Loading admin dashboard…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          All Listings
        </h2>

        {listings.length === 0 ? (
          <p className="text-gray-500">No listings found.</p>
        ) : (
          <div className="space-y-4">
            {listings.map(listing => (
              <div
                key={listing.id}
                className="bg-white border rounded-xl p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold">{listing.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {listing.type} · ₦{Number(listing.price).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => deleteListing(listing.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <AdminCard
          title="User Management"
          description="Delete user accounts"
          href="/admin/users"
        />
        <AdminCard
          title="KYC & Verification"
          description="Review documents"
          href="/admin/verifications"
        />
      </div>
    </div>
  );
}


function AdminCard({ title, description, href }) {
  return (
    <Link
      href={href}
      className="bg-white border rounded-xl p-6 hover:shadow-sm transition"
    >
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">
        {description}
      </p>
    </Link>
  );
}
