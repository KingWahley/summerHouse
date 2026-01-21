import Link from "next/link";
import { Heart, BedDouble, Bath, Ruler } from "lucide-react";

export default function ListingCard({ listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block bg-[#E9EFF2] rounded-t-2xl overflow-hidden border border-[#A64F03] hover:shadow-md transition"
    >
      <div className="relative">
        <img
          src={listing.images?.[0] || "/placeholder.jpg"}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex flex-row justify-between">
          <p className="text-left text-xl font-semibold text-[#4478A6]">
            ₦{Number(listing.price).toLocaleString()}
            {listing.listing_type === "rent" && (
              <span className="text-sm font-medium text-[#734440]">
                {" "}
                / year
              </span>
            )}
            {listing.listing_type === "sale" && (
              <span className="text-sm font-medium text-[#734440]">
                {" "}
                (outright)
              </span>
            )}
          </p>
          <p className="text-xl font-semibold text-[#F28705]">
            {listing.listing_type === "rent" && (
              <span className="text-sm font-medium text-[#734440]">
                {" "}
                for rent
              </span>
            )}
            {listing.listing_type === "sale" && (
              <span className="text-sm font-medium text-[#734440]">
                {" "}
                for sale
              </span>
            )}
          </p>
        </div>

        <p className="text-sm text-[#734440] truncate">
          {listing.city}, {listing.state}
        </p>

        <div className="flex items-center gap-4 text-xs text-[#A64F03] mt-2">
          {listing.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble size={14} />
              {listing.bedrooms} bd
            </span>
          )}

          {listing.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bath size={14} />
              {listing.bathrooms} ba
            </span>
          )}

          {listing.size && (
            <span className="flex items-center gap-1">
              <Ruler size={14} />
              {listing.size} sqft
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
