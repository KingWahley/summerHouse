import ListingCard from "./ListingCard";

export default function ListingsGrid({ listings }) {
  if (listings.length === 0) {
    return <p className="text-gray-500">No properties found.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
