import ContactAgent from "./ContactAgent";
import { BedDouble, Bath, Car, Sofa, Home } from "lucide-react";

import { Wifi, ShieldCheck, Droplets, Dumbbell, Waves } from "lucide-react";

const AMENITY_ICONS = {
  Water: Droplets,
  Electricity: Home,
  Security: ShieldCheck,
  Parking: Car,
  Internet: Wifi,
  Furnished: Sofa,
  "Swimming Pool": Waves,
  Gym: Dumbbell,
};

export default function ListingInfoCard({ listing }) {
  const facilities = [
    listing.bedrooms > 0 && {
      label: `${listing.bedrooms} beds`,
      Icon: BedDouble,
    },
    listing.bathrooms > 0 && {
      label: `${listing.bathrooms} baths`,
      Icon: Bath,
    },
    listing.parking > 0 && {
      label: `${listing.parking} parking`,
      Icon: Car,
    },
    listing.furnished && {
      label: "Furnished",
      Icon: Sofa,
    },
  ].filter(Boolean);

  return (
    <section className="relative z-10">
      <div
        className="bg-white rounded-t-[28px] md:rounded-2xl 
        px-6 pt-6 pb-8 md:p-10 
        -mt-6 md:mt-0
        max-w-5xl mx-auto
        md:shadow-sm"
      >
        <div className="mb-6">
          <h1 className="text-lg md:text-2xl font-semibold text-gray-900">
            {listing.title}
          </h1>

          <div className="flex items-center justify-between mt-2">
            <p className="text-sm md:text-base text-teal-500">
              {listing.city} - {listing.state}, {listing.country}
            </p>

            <div className="flex items-center gap-1 text-sm text-gray-500">
              ★ <span className="font-medium">4.7</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xl md:text-3xl font-semibold text-pink-400">
            ₦{Number(listing.price).toLocaleString()}
            {listing.listing_type === "rent" && (
              <span className="text-sm md:text-base font-medium text-gray-400">
                {" "}
                / year
              </span>
            )}
            {listing.listing_type === "sale" && (
              <span className="text-sm md:text-base font-medium text-gray-400">
                {" "}
                (outright)
              </span>
            )}
          </p>
        </div>

        <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-8 max-w-3xl">
          {listing.description}
        </p>

        {facilities.length > 0 && (
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-800 mb-4 lowercase">
              facilities
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {facilities.map(({ label, Icon }, i) => (
                <Facility key={i} label={label} Icon={Icon} />
              ))}
            </div>
          </div>
        )}

        {listing.amenities?.length > 0 && (
          <div className="mb-10">
            <p className="text-sm font-semibold text-gray-800 mb-4 lowercase">
              amenities
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {listing.amenities.map((amenity) => {
                const Icon = AMENITY_ICONS[amenity] || Home;
                return <Facility key={amenity} label={amenity} Icon={Icon} />;
              })}
            </div>
          </div>
        )}

        <div className="pt-6 border-t">
          <ContactAgent listingId={listing.id} agentId={listing.owner_id} />
        </div>
      </div>
    </section>
  );
}

function Facility({ Icon, label }) {
  return (
    <div className="flex items-center gap-2 bg-teal-50 text-teal-600 px-3 py-2 rounded-xl text-xs md:text-sm font-medium">
      <Icon size={14} strokeWidth={2} />
      <span className="capitalize">{label}</span>
    </div>
  );
}

