import Link from "next/link";

export default function ListingCard({ listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="bg-white border rounded-xl p-5 hover:shadow-sm transition"
    >
      <h3 className="font-semibold text-lg truncate">
        {listing.title}
      </h3>

      <p className="text-gray-500 text-sm mt-1 truncate">
        {listing.city || "Location not specified"}
      </p>

      <p className="mt-3 font-bold">
        ₦{Number(listing.price).toLocaleString()}
      </p>

      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
        {listing.description}
      </p>
    </Link>
  );
}
