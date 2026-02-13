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
    <div className="home-shell min-h-screen bg-gradient-to-b from-[#f7f4ee] via-white to-[#f4f1ea] px-4">
      <div className="max-w-6xl mx-auto py-16 lg:py-20 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#9b9489]">
            Create your account
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#2b2a27] mt-4">
            Start saving and touring verified properties.
          </h1>
          <p className="text-base text-[#5b5a56] mt-4 max-w-xl">
            Build your shortlist, schedule inspections, and keep every
            conversation in one place.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-[#e7dfd2] bg-white/80 p-4">
              <p className="text-sm font-semibold text-[#2b2a27]">
                Personalized alerts
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#9b9489] mt-2">
                Get notified when new homes match you
              </p>
            </div>
            <div className="rounded-2xl border border-[#e7dfd2] bg-white/80 p-4">
              <p className="text-sm font-semibold text-[#2b2a27]">
                Trusted support
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#9b9489] mt-2">
                Verified owners & agents only
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto rounded-3xl border border-[#e7dfd2] bg-white/90 p-8 shadow-[0_25px_60px_rgba(31,41,55,0.12)]">
          <h2 className="text-2xl font-semibold text-[#2b2a27]">
            Create account
          </h2>
          <p className="text-sm text-[#5b5a56] mt-2">
            Set up your SummerHouse profile in minutes.
          </p>

          {error && (
            <div className="mt-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
              We’ve sent a verification link to your email. Please verify your
              account to continue.
            </div>
          )}

          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-[#9b9489]">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 text-sm text-[#2b2a27] placeholder-[#9b9489] focus:border-[#cfc6b8] focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-[#9b9489]">
                Password
              </label>
              <input
                type="password"
                placeholder="Password (min 8 characters)"
                className="mt-2 w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 text-sm text-[#2b2a27] placeholder-[#9b9489] focus:border-[#cfc6b8] focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-2xl bg-[#2b2a27] text-white py-3 text-sm font-semibold hover:bg-[#1c1b19] disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-[#5b5a56]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#2b2a27] font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
