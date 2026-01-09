"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function ListingsPage() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    setUser(user || null);

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setRole(profile?.role);
      fetchUserListings(user.id, profile?.role);
    } else {
      fetchPublicListings();
    }
  }

  async function fetchPublicListings() {
    setLoading(true);

    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    setListings(data || []);
    setLoading(false);
  }

  async function fetchUserListings(userId, role) {
    setLoading(true);

    if (role === "agent" || role === "owner") {
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });

      setListings(data || []);
    } else {
      fetchPublicListings();
      return;
    }

    setLoading(false);
  }

  function statusBadge(status) {
    const styles = {
      draft: "bg-gray-200 text-gray-700",
      pending: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-700",
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {role === "agent" || role === "owner"
            ? "My Listings"
            : "Available Listings"}
        </h1>

        {(role === "agent" || role === "owner") && (
          <Link
            href="/listings/create"
            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Property
          </Link>
        )}
      </div>

      {loading && (
        <p className="text-gray-500">Loading listings…</p>
      )}

      {!loading && listings.length === 0 && (
        <p className="text-gray-500">
          No listings found.
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map(listing => (
          <div
            key={listing.id}
            className="bg-white border rounded-xl p-5 hover:shadow-sm transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg truncate">
                {listing.title}
              </h3>
              {statusBadge(listing.status)}
            </div>

            <p className="text-gray-500 text-sm truncate">
              {listing.location || "Location not specified"}
            </p>

            <p className="mt-3 font-bold">
              ₦{Number(listing.price).toLocaleString()}
            </p>

            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {listing.description}
            </p>

            <div className="mt-4 flex justify-between items-center text-sm">
              <Link
                href={`/listings/${listing.id}`}
                className="text-black font-medium hover:underline"
              >
                View details
              </Link>

              {(role === "agent" || role === "owner") && (
                <Link
                  href={`/listings/edit/${listing.id}`}
                  className="text-gray-500 hover:underline"
                >
                  Edit
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
