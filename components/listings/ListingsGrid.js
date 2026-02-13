import ListingCard from "./ListingCard";

export default function ListingsGrid({ listings }) {
  if (listings.length === 0) {
    return (
      <div className="rounded-3xl border border-[#e7dfd2] bg-white/70 p-12 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-[#9b9489]">
          No results
        </p>
        <h3 className="text-2xl font-semibold text-[#2b2a27] mt-3">
          We could not find listings that match those filters.
        </h3>
        <p className="text-sm text-[#5b5a56] mt-3">
          Try a broader search or clear a few filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
