"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function Navbar() {
  const { user, role, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = getSupabaseClient();
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
        <div className="hidden md:flex gap-6 text-sm font-medium items-center">
          <Link href="/listings" className={isActive("/listings")}>
            Listings
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
          {loading ? null : !user ? (
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
