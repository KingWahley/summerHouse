"use client";

import { useEffect, useState } from "react";
import ListingCarousel from "@/components/listings/ListingCarousel";
import { fetchPublicListings } from "@/lib/listings";
import Link from "next/link";

export default function HeroSection() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadListings() {
    setLoading(true);
    try {
      const data = await fetchPublicListings({ query: "", filters: {} });
      setResults(data.slice(0, 6));
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadListings();
  }, []);


  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#f7e7cc,transparent_55%),radial-gradient(circle_at_20%_60%,#dce7f3,transparent_50%),linear-gradient(180deg,#f7f4ee_0%,#ffffff_100%)]" />
      <div className="absolute -top-24 right-10 h-48 w-48 rounded-full bg-[#f1d7bd] blur-3xl opacity-70" />
      <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-[#d6e4f5] blur-3xl opacity-80" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 pt-12 pb-14 lg:pt-24 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e0d9cc] bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[#6b6a65]">
              Verified homes in one place
            </div>

            <h1 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#2b2a27] leading-tight">
              A calmer way to find, list, and manage property.
            </h1>
            <p className="mt-4 text-sm sm:text-lg text-[#5b5a56] max-w-xl">
              SummerHouse connects buyers, renters, owners, and agents with
              verified listings, transparent workflows, and fast scheduling.
            </p>

            <form className="mt-7">
              <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-[#e0d9cc] bg-white/90 p-3 shadow-[0_18px_50px_rgba(34,40,49,0.12)]">
                <input
                  type="text"
                  placeholder="Search by city, price, or property type"
                  className="flex-1 bg-transparent px-3 py-3 text-sm sm:text-base text-[#2b2a27] placeholder-[#9b9489] focus:outline-none"
                />
                <Link href="/listings" className="sm:self-stretch">
                  <button
                    type="button"
                    className="w-full sm:w-auto rounded-xl bg-[#2b2a27] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1c1b19]"
                  >
                    Search listings
                  </button>
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#8a8378]">
                <span>Verified owners</span>
                <span>Secure payments</span>
                <span>Guided inspections</span>
              </div>
            </form>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg">
              <Stat label="Listings" value="2.4k+" />
              <Stat label="Cities" value="42" />
              <div className="hidden sm:block">
                <Stat label="Avg. response" value="8 mins" />
              </div>
            </div>
          </div>

          <div className="relative min-w-0">
            <div className="rounded-[28px] border border-[#e7dfd2] bg-white/90 p-4 sm:p-6 shadow-[0_25px_60px_rgba(31,41,55,0.12)] max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#9b9489]">
                    Featured
                  </p>
                  <h2 className="text-2xl font-semibold text-[#2b2a27] mt-2">
                    Trending listings
                  </h2>
                </div>
                <Link
                  href="/listings"
                  className="text-sm font-medium text-[#2b2a27] hover:text-[#1c1b19]"
                >
                  View all
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d6d0c4] border-t-[#2b2a27]" />
                </div>
              ) : results.length === 0 ? (
                <p className="text-center text-[#8a8378] py-10">
                  No listings found.
                </p>
              ) : (
                <ListingCarousel listings={results.slice(0, 6)} />
              )}
            </div>
            <div className="absolute -bottom-6 -left-6 hidden lg:block rounded-3xl border border-[#e7dfd2] bg-white/80 px-5 py-4 shadow-[0_20px_45px_rgba(31,41,55,0.12)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#9b9489]">
                Trusted by teams
              </p>
              <p className="text-base font-semibold text-[#2b2a27] mt-2">
                150+ property managers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-2xl font-semibold text-[#2b2a27]">{value}</p>
      <p className="text-xs uppercase tracking-[0.2em] text-[#8a8378] mt-1">
        {label}
      </p>
    </div>
  );
}
