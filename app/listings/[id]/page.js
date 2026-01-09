import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import ContactAgent from "./ContactAgent";

export const revalidate = 60;

export default async function ListingDetailPage({ params }) {
  const { id } = params;
  const supabase = createSupabaseServerClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (!listing) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Images */}
      {listing.images?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {listing.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={listing.title}
              className="w-full h-64 object-cover rounded-xl"
            />
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">{listing.title}</h1>
            <p className="text-gray-500">
              {listing.city}, {listing.state}, {listing.country}
            </p>

            <p className="text-2xl font-bold mt-4">
              ₦{Number(listing.price).toLocaleString()}
              {listing.listing_type === "rent" && (
                <span className="text-sm font-medium text-gray-500">
                  {" "} / year
                </span>
              )}
            </p>
          </div>

          <div className="flex gap-6 text-sm text-gray-600">
            <span>{listing.bedrooms} Bedrooms</span>
            <span>{listing.bathrooms} Bathrooms</span>
            <span>{listing.parking} Parking</span>
            {listing.furnished && <span>Furnished</span>}
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {listing.description}
            </p>
          </section>

          {listing.amenities?.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-3">
                {listing.amenities.map(a => (
                  <span
                    key={a}
                    className="px-3 py-1.5 bg-gray-100 rounded text-sm"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Client interaction */}
        <aside className="border rounded-xl p-6 bg-white h-fit">
          <ContactAgent
            listingId={listing.id}
            agentId={listing.owner_id}
          />
        </aside>
      </div>
    </div>
  );
}
