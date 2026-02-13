import Link from "next/link";
import { BedDouble, Bath, Ruler, MapPin } from "lucide-react";

export default function ListingCard({ listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block w-full h-full overflow-hidden rounded-3xl border border-[#e7dfd2] bg-white/90 shadow-[0_18px_45px_rgba(31,41,55,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(31,41,55,0.12)]"
    >
      <div className="relative">
        <img
          src={listing.images?.[0] || "/placeholder.jpg"}
          alt={listing.title}
          className="w-full h-52 object-cover"
        />
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2b2a27]">
          {listing.listing_type === "rent" ? "For rent" : "For sale"}
        </span>
      </div>

      <div className="p-5 space-y-3">
        <div>
          <p className="text-xl font-semibold text-[#2b2a27]">
            NGN {Number(listing.price).toLocaleString()}
            {listing.listing_type === "rent" && (
              <span className="text-sm font-medium text-[#9b9489]">
                {" "}
                / year
              </span>
            )}
          </p>
          <p className="text-sm text-[#5b5a56] truncate mt-1">
            {listing.title}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#9b9489]">
          <MapPin size={14} />
          <span className="truncate">
            {listing.city}, {listing.state}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#5b5a56]">
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

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[#c2b8aa]">
            Verified
          </span>
          <span className="text-sm font-medium text-[#2b2a27]">
            View details
          </span>
        </div>
      </div>
    </Link>
  );
}
