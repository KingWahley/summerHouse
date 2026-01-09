"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { ROLES } from "@/lib/roles";

export default function AdminUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const supabase = getSupabaseClient();

    // 1️⃣ Auth check
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session?.user) {
      router.replace("/auth/login");
      return;
    }

    // 2️⃣ Admin check
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();

    if (profile?.role !== ROLES.ADMIN) {
      router.replace("/dashboard");
      return;
    }

    // 3️⃣ Fetch users + listing count
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        role,
        created_at,
        auth_users:auth.users (
          email
        ),
        listings (
          id
        )
      `);

    if (!error) {
      const formatted = data.map(user => ({
        id: user.id,
        name: user.full_name || "Unnamed",
        email: user.auth_users?.email || "—",
        role: user.role,
        totalListings: user.listings?.length || 0,
        createdAt: user.created_at
      }));

      setUsers(formatted);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-10 text-gray-500">
        Loading users…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">
        User Overview
      </h1>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Total Listings</th>
                <th className="text-left p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="p-4 font-medium">
                    {user.name}
                  </td>
                  <td className="p-4">
                    {user.email}
                  </td>
                  <td className="p-4 capitalize">
                    {user.role}
                  </td>
                  <td className="p-4 font-medium">
                    {user.totalListings}
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
