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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
          <p className="text-sm text-gray-600">loading Dashboard</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-10">Please log in.</div>;
  }

  if (role === "buyer") return <BuyerDashboard />;
  if (role === "agent" || role === "owner") return <AgentDashboard />;

  return null;
}
