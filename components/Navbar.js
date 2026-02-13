"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { Menu, X } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import Image from "next/image";
import { useUnreadMessages } from "@/components/useUnreadMessages";

export default function Navbar() {
  const { user, role, loading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  }
   const unread = useUnreadMessages();

  const isActive = (path) =>
    pathname === path ? "text-black" : "text-gray-500";

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-[#ede7da]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* <Image
            src="/assets/summerlogo.png"
            alt="SummerHouse Logo"
            width={52}
            height={36}
          /> */}
          <span className="hidden sm:block text-sm uppercase tracking-[0.3em] text-[#9b9489]">
            SummerHouse
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-2 rounded-full border border-[#e5ddcf] bg-white/70 px-4 py-2 text-sm font-medium text-[#5b5a56]">
          <Link href="/" className={`px-3 py-1.5 rounded-full ${isActive("/")}`}>
            Home
          </Link>
          <Link
            href="/listings"
            className={`px-3 py-1.5 rounded-full ${isActive("/listings")}`}
          >
            Listings
          </Link>

          {user && (role === "agent" || role === "owner") && (
            <Link
              href="/listings/create"
              className={`px-3 py-1.5 rounded-full ${isActive("/listings/create")}`}
            >
              Add Property
            </Link>
          )}

          {user && (role === "agent" || role === "owner") && (
            <Link href="/messages" className="relative px-3 py-1.5 rounded-full">
              <span className={isActive("/messages")}>Messages</span>
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-semibold rounded-full bg-rose-500 text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
          )}

          {user && (
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-full ${isActive("/dashboard")}`}
            >
              Dashboard
            </Link>
          )}

          {user && role === "admin" && (
            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded-full ${isActive("/admin")}`}
            >
              Admin
            </Link>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3 text-sm">
          {loading ? null : !user ? (
            <>
              <Link
                href="/auth/login"
                className="text-[#5b5a56] hover:text-[#2b2a27]"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-[#2b2a27] text-white px-4 py-2 font-semibold hover:bg-[#1c1b19]"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <span className="text-xs uppercase tracking-[0.2em] text-[#9b9489]">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-[#e5ddcf] px-4 py-2 text-[#5b5a56] hover:border-[#cfc6b8] hover:text-[#2b2a27]"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden rounded-full border border-[#e5ddcf] p-2 text-[#2b2a27]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#ede7da] bg-white/95 px-6 py-4 text-sm">
          <div className="grid gap-3">
            <Link href="/" className="py-2" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link
              href="/listings"
              className="py-2"
              onClick={() => setMobileOpen(false)}
            >
              Listings
            </Link>

            {user && (role === "agent" || role === "owner") && (
              <Link
                href="/listings/create"
                className="py-2"
                onClick={() => setMobileOpen(false)}
              >
                Add Property
              </Link>
            )}

            {user && (role === "agent" || role === "owner") && (
              <Link
                href="/messages"
                className="py-2"
                onClick={() => setMobileOpen(false)}
              >
                Messages
              </Link>
            )}

            {user && (
              <Link
                href="/dashboard"
                className="py-2"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {user && role === "admin" && (
              <Link
                href="/admin"
                className="py-2"
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-[#ede7da] flex flex-col gap-3">
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className="py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-full bg-[#2b2a27] text-white text-center py-2 font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <span className="text-xs uppercase tracking-[0.2em] text-[#9b9489]">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-[#e5ddcf] py-2 text-[#5b5a56]"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
