"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient } from "../lib/supabaseClient";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    // Initial session load
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
      if (data?.user) fetchRole(data.user.id);
    });

    // Auth listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          fetchRole(session.user.id);
        } else {
          setRole(null);
        }
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  async function fetchRole(userId) {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    setRole(data?.role || null);
  }

  async function handleLogout() {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  const isActive = (path) =>
    pathname === path ? "text-black" : "text-gray-500";

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-xl font-bold">
          RealHouse
        </Link>

        {/* Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/search" className={isActive("/search")}>
            Search
          </Link>

          {user && (role === "agent" || role === "owner") && (
            <Link
              href="/listings/create"
              className={isActive("/listings/create")}
            >
              Add Property
            </Link>
          )}

          {user && (
            <Link href="/dashboard" className={isActive("/dashboard")}>
              Dashboard
            </Link>
          )}

          {user && role === "admin" && (
            <Link href="/admin" className={isActive("/admin")}>
              Admin
            </Link>
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-4 text-sm">
          {!user ? (
            <>
              <Link href="/auth/login">Login</Link>
              <Link
                href="/auth/signup"
                className="bg-black text-white px-4 py-2 rounded-md"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <span className="hidden sm:block text-gray-500">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="border px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
