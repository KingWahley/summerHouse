
"use client";
import { supabase } from "@/lib/supabaseClient";

export default function SocialAuthButtons() {
  return (
    <div className="space-y-3">
      <button
        onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
        className="w-full border py-3 rounded"
      >
        Continue with Google
      </button>
      <button
        onClick={() => supabase.auth.signInWithOAuth({ provider: "apple" })}
        className="w-full border py-3 rounded"
      >
        Continue with Apple
      </button>
    </div>
  );
}
