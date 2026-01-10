export const dynamic = "force-dynamic";
// "use client";

// import { useEffect, useState } from "react";
// import { getSupabaseClient } from "../../lib/supabaseClient";

// export default function SearchPage() {
//   const [query, setQuery] = useState("");
//   const [filters, setFilters] = useState({
//     type: "",
//     minPrice: "",
//     maxPrice: ""
//   });
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchListings();
//   }, []);

//   async function fetchListings(searchText = query) {
//     const supabase = getSupabaseClient();
//     if (!supabase) return;

//     setLoading(true);

//     let q = supabase
//       .from("listings")
//       .select("*")
//       .eq("status", "active")
//       .order("created_at", { ascending: false });

//     if (searchText) {
//       q = q.or(
//         `title.ilike.%${searchText}%,description.ilike.%${searchText}%`
//       );
//     }

//     if (filters.type) {
//       q = q.eq("type", filters.type);
//     }

//     if (filters.minPrice) {
//       q = q.gte("price", filters.minPrice);
//     }

//     if (filters.maxPrice) {
//       q = q.lte("price", filters.maxPrice);
//     }

//     const { data, error } = await q.limit(20);

//     if (!error) {
//       setResults(data || []);
//     }

//     setLoading(false);
//   }

//   function handleSubmit(e) {
//     e.preventDefault();
//     fetchListings();
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-10">
//       <h1 className="text-3xl font-bold mb-6">Search Properties</h1>

//       <form
//         onSubmit={handleSubmit}
//         className="grid md:grid-cols-4 gap-4 mb-10"
//       >
//         <input
//           value={query}
//           onChange={e => setQuery(e.target.value)}
//           placeholder="Location, keyword, property name"
//           className="md:col-span-2 border p-3 rounded-md"
//         />

//         <select
//           className="border p-3 rounded-md"
//           value={filters.type}
//           onChange={e =>
//             setFilters({ ...filters, type: e.target.value })
//           }
//         >
//           <option value="">All Types</option>
//           <option value="apartment">Apartment</option>
//           <option value="house">House</option>
//           <option value="land">Land</option>
//           <option value="commercial">Commercial</option>
//         </select>

//         <button
//           type="submit"
//           className="bg-black text-white rounded-md px-4 py-3 font-medium"
//         >
//           Search
//         </button>

//         <input
//           type="number"
//           placeholder="Min price"
//           className="border p-3 rounded-md"
//           value={filters.minPrice}
//           onChange={e =>
//             setFilters({ ...filters, minPrice: e.target.value })
//           }
//         />

//         <input
//           type="number"
//           placeholder="Max price"
//           className="border p-3 rounded-md"
//           value={filters.maxPrice}
//           onChange={e =>
//             setFilters({ ...filters, maxPrice: e.target.value })
//           }
//         />
//       </form>

//       {loading && <p className="text-gray-500">Searching…</p>}

//       {!loading && results.length === 0 && (
//         <p className="text-gray-500">No properties found.</p>
//       )}

//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {results.map(listing => (
//           <div
//             key={listing.id}
//             className="bg-white border rounded-xl p-5"
//           >
//             <h3 className="font-semibold text-lg truncate">
//               {listing.title}
//             </h3>

//             <p className="text-gray-500 text-sm mt-1 truncate">
//               {listing.location || "Location not specified"}
//             </p>

//             <p className="mt-3 font-bold">
//               ₦{Number(listing.price).toLocaleString()}
//             </p>

//             <p className="mt-2 text-sm text-gray-600 line-clamp-2">
//               {listing.description}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
