import Link from "next/link";
import { Heart, BedDouble, Bath, Ruler } from "lucide-react";

export default function ListingCard({ listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block bg-white rounded-t-2xl overflow-hidden border hover:shadow-md transition"
    >
      <div className="relative">
        <img
          src={listing.images?.[0] || "/placeholder.jpg"}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />

        {/* <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-2 shadow-sm"
        >
          <Heart size={16} className="text-gray-700" />
        </button> */}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex flex-row justify-between">
          <p className="text-left text-xl font-semibold ">
            ₦{Number(listing.price).toLocaleString()}
            {listing.listing_type === "rent" && (
              <span className="text-sm font-medium text-gray-400"> / year</span>
            )}
            {listing.listing_type === "sale" && (
              <span className="text-sm font-medium text-gray-400">
                {" "}
                (outright)
              </span>
            )}
          </p>
          <p className=" text-xl font-semibold text-pink-400">
            {listing.listing_type === "rent" && (
              <span className="text-sm font-medium text-gray-400">
                {" "}
                for rent
              </span>
            )}
            {listing.listing_type === "sale" && (
              <span className="text-sm font-medium text-gray-400">
                {" "}
                for sale
              </span>
            )}
          </p>
        </div>

        <p className="text-sm text-gray-500 truncate">
          {listing.city}, {listing.state}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
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
