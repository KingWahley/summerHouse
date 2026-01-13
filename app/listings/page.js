"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/listings/SearchBar";
import FiltersWrapper from "@/components/listings/FiltersWrapper";
import ListingsGrid from "@/components/listings/ListingsGrid";
import { fetchPublicListings } from "@/lib/listings";
import { Search } from "lucide-react";
import Footer from "@/components/Footer";


export default function PublicListingsPage() {
  const [query, setQuery] = useState("");

  const [draftFilters, setDraftFilters] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load({ q = query, f = appliedFilters } = {}) {
    setLoading(true);
    const data = await fetchPublicListings({
      query: q,
      filters: f,
    });
    setResults(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    load({ q: query });
  }

  function handleApplyFilters() {
    setAppliedFilters(draftFilters);
    load({ f: draftFilters });
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <h1 className="text-medium font-bold mb-6">Browse Properties</h1>

      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-row justify-center md:justify-start px-2 py-5 sticky bg-gray-50 top-20 gap-3 z-20 w-full mb-8"
      >
        <SearchBar value={query} onChange={setQuery} />
        <FiltersWrapper
          filters={draftFilters}
          setFilters={setDraftFilters}
          onApply={handleApplyFilters}
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-black text-white rounded-md px-4 py-3 font-medium"
        >
          <Search size={16} />
        </button>
      </form>

      {loading ? (
        <div className=" z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
          <p className="text-sm text-gray-600">loading Listings</p>
        </div>
      </div>
      ) : (
        <ListingsGrid listings={results} />
      )}
      <Footer/>
    </div>
    
  );
}
