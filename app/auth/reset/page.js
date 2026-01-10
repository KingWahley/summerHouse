"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = getSupabaseClient();


  async function handleReset(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">
        Reset your password
      </h1>

      <p className="text-gray-500 mb-6">
        Enter your email and we’ll send you a secure reset link.
      </p>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded">
          Check your email for the password reset link.
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="email"
          className="w-full border p-3 rounded-md"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-md font-medium disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <div className="mt-6 text-sm">
        <Link
          href="/auth/login"
          className="text-gray-600 hover:underline"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
