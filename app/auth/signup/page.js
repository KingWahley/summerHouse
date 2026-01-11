"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseClient } from "../../../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase not configured.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (!data.session) {
      setSuccess(true);
      return;
    }

    router.replace("/profile/setup");
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Create your account</h1>
      <p className="text-gray-500 mb-6">
        Join RealHouse to find and manage verified properties.
      </p>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded">
          We’ve sent a verification link to your email.  
          Please verify your account to continue.
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          className="w-full border p-3 rounded-md"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 8 characters)"
          className="w-full border p-3 rounded-md"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={8}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-md font-medium disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <div className="mt-6 text-sm text-center">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-black font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </>
  );
}
