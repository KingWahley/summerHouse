"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { Menu, X } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import Image from "next/image";

export default function Navbar() {
  const { user, role, loading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  }

  const isActive = (path) =>
    pathname === path ? "text-black" : "text-gray-500";



  
  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" >
          <Image
            src="/assets/summerlogo.png"
            alt="summerlogo Logo"
            width={60} 
            height={40} 
          />
        </Link>

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

        <div className="hidden md:flex items-center gap-4 text-sm">
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
              <span className="text-gray-500">{user.email}</span>
              <button
                onClick={handleLogout}
                className="border px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-6 py-4 space-y-4 text-sm font-medium">
          <Link
            href="/listings"
            className="block"
            onClick={() => setMobileOpen(false)}
          >
            Listings
          </Link>

          {user && (role === "agent" || role === "owner") && (
            <Link
              href="/listings/create"
              className="block"
              onClick={() => setMobileOpen(false)}
            >
              Add Property
            </Link>
          )}

          {user && (
            <Link
              href="/dashboard"
              className="block"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {user && role === "admin" && (
            <Link
              href="/admin"
              className="block"
              onClick={() => setMobileOpen(false)}
            >
              Admin
            </Link>
          )}

          <div className="pt-4 border-t space-y-3">
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className="block"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block bg-black text-white text-center py-2 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <span className="block text-gray-500">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="w-full border py-2 rounded-md"
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
