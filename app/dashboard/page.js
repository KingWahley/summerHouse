"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "../../lib/supabaseClient";

import BuyerDashboard from "./buyer";
import AgentDashboard from "./agent";
// import AdminDashboard from "./admin";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      // 1️⃣ Get session (authoritative)
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/auth/login");
        return;
      }

      // 2️⃣ Fetch profile safely
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle(); // ✅ IMPORTANT

      if (!active) return;

      if (error) {
        console.error("Profile fetch error:", error.message);
        router.replace("/profile/setup");
        return;
      }

      if (!data?.role) {
        router.replace("/profile/setup");
        return;
      }

      setRole(data.role);
      setLoading(false);
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Loading dashboard…
      </div>
    );
  }

 if (!role) return null;

if (role === "buyer") return <BuyerDashboard />;
if (role === "agent" || role === "owner") return <AgentDashboard />;

if (role === "admin") {
  router.replace("/admin");
  return null;
}

return (
  <div className="p-10 text-gray-500">
    Unknown role
  </div>
);

}
