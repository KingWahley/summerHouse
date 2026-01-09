"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import BuyerDashboard from "./buyer";
import AgentDashboard from "./agent";

export default function DashboardPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role === "admin") {
      router.replace("/admin");
    }
  }, [loading, role, router]);

  if (loading) {
    return (
      <div className="p-10 text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  if (!user) {
    return <div className="p-10">Please log in.</div>;
  }

  if (role === "buyer") return <BuyerDashboard />;
  if (role === "agent" || role === "owner") return <AgentDashboard />;

  // Admins are redirected via useEffect
  return null;
}
