import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import ImageGallery from "./ImageGallery";
import ListingInfoCard from "./ListingInfoCard";

export const revalidate = 60;

export default async function ListingDetailPage({ params }) {
  const supabase = createSupabaseServerClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", params.id)
    .eq("status", "active")
    .single();

  if (!listing) notFound();

  return (
    <div>
      <div className="text-center p-6 sticky top-0 z-20 bg-white">
        <p className=" text-xl font-semibold text-pink-400">
          {listing.listing_type === "rent" && (
            <span className="text-sm font-medium text-gray-400"> for rent</span>
          )}
          {listing.listing_type === "sale" && (
            <span className="text-sm font-medium text-gray-400"> for sale</span>
          )}
        </p>
      </div>

      <div className="min-h-screen bg-gray-100 flex justify-center py-6">
        <div className="w-full  bg-white  pb-[120px] overflow-hidden ">
          <ImageGallery images={listing.images || []} />

          <ListingInfoCard className="rounded-[28px] shadow-xl" listing={listing} />
        </div>
      </div>
    </div>
  );
}
