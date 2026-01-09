"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/listings/SearchBar";
import Filters from "@/components/listings/Filters";
import ListingsGrid from "@/components/listings/ListingsGrid";
import { fetchPublicListings } from "@/lib/listings";

export default function PublicListingsPage() {

  
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    minPrice: "",
    maxPrice: ""
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const data = await fetchPublicListings({ query, filters });
    setResults(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    load();
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Browse Properties
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-4 gap-4 mb-10"
      >
        <SearchBar value={query} onChange={setQuery} />
        <Filters filters={filters} setFilters={setFilters} />
        <button
          type="submit"
          className="bg-black text-white rounded-md px-4 py-3 font-medium"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading listings…</p>
      ) : (
        <ListingsGrid listings={results} />
      )}
    </div>
  );
}
