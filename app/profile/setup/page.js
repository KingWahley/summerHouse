"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "../../../lib/supabaseClient";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkSession() {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/auth/login");
      }
    }

    checkSession();
  }, [router]);

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase not configured.");
      setLoading(false);
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        role
      });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <div className="max-w-xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-2">Complete your profile</h1>
      <p className="text-gray-500 mb-6">
        Tell us a bit about yourself to continue.
      </p>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <input
          type="text"
          placeholder="Full name"
          className="w-full border p-3 rounded-md"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />

        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full border p-3 rounded-md"
        >
          <option value="buyer">Buyer / Renter</option>
          <option value="agent">Agent</option>
          <option value="owner">Property Owner</option>
        </select>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-md font-medium disabled:opacity-60"
        >
          {loading ? "Saving…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
