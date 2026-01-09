"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "./supabaseClient";

let cachedUser = null;
let cachedRole = null;

export function useAuth() {
  const [user, setUser] = useState(cachedUser);
  const [role, setRole] = useState(cachedRole);
  const [loading, setLoading] = useState(!cachedUser);

  useEffect(() => {
    if (cachedUser) return;

    const supabase = getSupabaseClient();

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) {
        setLoading(false);
        return;
      }

      cachedUser = data.user;
      setUser(data.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      cachedRole = profile?.role || null;
      setRole(cachedRole);
      setLoading(false);
    });
  }, []);

  return { user, role, loading };
}
