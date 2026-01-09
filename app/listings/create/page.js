"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseClient } from "@/lib/supabaseClient";

const AMENITIES = [
  "Water",
  "Electricity",
  "Security",
  "Parking",
  "Internet",
  "Furnished",
  "Swimming Pool",
  "Gym",
];

export default function CreateListingPage() {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  const [pageLoading, setPageLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    listing_type: "rent",
    type: "apartment",
    country: "Nigeria",
    state: "",
    city: "",
    bedrooms: 0,
    bathrooms: 0,
    parking: 0,
    furnished: false,
    negotiable: false,
    amenities: [],
  });

  /* ---------- ACCESS CONTROL ---------- */
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (!["agent", "owner", "admin"].includes(role)) {
      router.replace("/dashboard");
      return;
    }

    setPageLoading(false);
  }, [loading, user, role, router]);

  /* ---------- FORM HANDLERS ---------- */
  function update(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function toggleAmenity(item) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter((a) => a !== item)
        : [...prev.amenities, item],
    }));
  }

  /* ---------- IMAGE UPLOAD ---------- */
  async function uploadImages(files) {
    const supabase = getSupabaseClient();
    setUploading(true);

    const uploaded = [];

    for (const file of files) {
      const filePath = `${user.id}/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("property-media")
        .upload(filePath, file);

      if (!error) {
        const { data } = supabase.storage
          .from("property-media")
          .getPublicUrl(filePath);

        uploaded.push(data.publicUrl);
      }
    }

    setUploading(false);
    return uploaded;
  }

  /* ---------- SUBMIT ---------- */
  async function submit(e) {
    e.preventDefault();

    const supabase = getSupabaseClient();

    let imageUrls = [];
    if (images.length) {
      imageUrls = await uploadImages(images);
    }

    const { error } = await supabase.from("listings").insert({
      owner_id: user.id,
      ...form,
      images: imageUrls,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  }

  if (loading || pageLoading) {
    return <div className="p-10 text-gray-500">Loading…</div>;
  }

  /* ---------- UI ---------- */
  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Create Property Listing</h1>

      <form onSubmit={submit} className="space-y-6">
        {/* Basic info */}
        <input
          name="title"
          placeholder="Property title"
          className="w-full border p-3 rounded"
          onChange={update}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-3 rounded h-32"
          onChange={update}
        />

        {/* Pricing */}
        <div className="grid md:grid-cols-3 gap-4">
          <input
            name="price"
            type="number"
            placeholder="Price"
            className="border p-3 rounded"
            onChange={update}
            required
          />

          <select
            name="listing_type"
            className="border p-3 rounded"
            onChange={update}
          >
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>

          <select name="type" className="border p-3 rounded" onChange={update}>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        {/* Location */}
        <div className="grid md:grid-cols-3 gap-4">
          <input
            name="country"
            placeholder="Country"
            className="border p-3 rounded"
            onChange={update}
          />
          <input
            name="state"
            placeholder="State"
            className="border p-3 rounded"
            onChange={update}
          />
          <input
            name="city"
            placeholder="City"
            className="border p-3 rounded"
            onChange={update}
          />
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-3 gap-4">
          <input
            name="bedrooms"
            type="number"
            placeholder="Bedrooms"
            className="border p-3 rounded"
            onChange={update}
          />
          <input
            name="bathrooms"
            type="number"
            placeholder="Bathrooms"
            className="border p-3 rounded"
            onChange={update}
          />
          <input
            name="parking"
            type="number"
            placeholder="Parking spaces"
            className="border p-3 rounded"
            onChange={update}
          />
        </div>

        {/* Amenities */}
        <div>
          <p className="font-medium mb-2">Amenities</p>
          <div className="flex flex-wrap gap-3">
            {AMENITIES.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => toggleAmenity(a)}
                className={`px-3 py-1.5 rounded border text-sm ${
                  form.amenities.includes(a)
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <p className="font-medium mb-2">Property Images</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...e.target.files])}
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading images…</p>
          )}
        </div>

        {/* Flags */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="furnished" onChange={update} />
            Furnished
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="negotiable" onChange={update} />
            Price negotiable
          </label>
        </div>

        <button className="bg-black text-white px-8 py-3 rounded">
          Publish Listing
        </button>
      </form>
    </div>
  );
}
