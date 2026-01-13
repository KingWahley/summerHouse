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
  const [step, setStep] = useState(0); // current form step
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

  useEffect(() => {
    if (loading) return;
    if (!user) return router.replace("/auth/login");
    if (!["agent", "owner", "admin"].includes(role))
      return router.replace("/dashboard");
    setPageLoading(false);
  }, [loading, user, role, router]);

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

  async function submit(e) {
    e.preventDefault();
    const supabase = getSupabaseClient();
    let imageUrls = [];
    if (images.length) imageUrls = await uploadImages(images);
    const { error } = await supabase
      .from("listings")
      .insert({ owner_id: user.id, ...form, images: imageUrls });
    if (error) return alert(error.message);
    router.push("/dashboard");
  }

  if (loading || pageLoading)
    return <div className="p-10 text-gray-500">Loading…</div>;

  const steps = ["Basic Info", "Location & Features", "Images & Publish"];

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-8">
      <h1 className="text-4xl  font-bold text-gray-900 text-center">
        Create Property Listing
      </h1>

      <div className="flex sticky py-4 rounded-2xl bg-white top-[90px] justify-between mb-6">
        {steps.map((s, i) => (
          <div key={i} className="flex-1 text-center relative">
            {" "}
            <div
              className={`w-8 h-8   mx-auto rounded-full border-2  transition ${
                i <= step
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-500"
              } flex items-center justify-center `}
            >
              {i + 1}
            </div>
            <p className="mt-2 text-sm">{s}</p>
            {i < steps.length - 1 && (
              <div
                className={`absolute top-4 right-0 w-full h-0.5 ${
                  i < step ? "bg-black" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="space-y-6 bg-white shadow-lg rounded-2xl p-8"
      >
        {step === 0 && (
          <div className="space-y-4">
            <input
              name="title"
              placeholder="Property title"
              className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black transition"
              onChange={update}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              className="w-full border border-gray-300 rounded-xl p-4 h-32 focus:outline-none focus:ring-2 focus:ring-black transition"
              onChange={update}
            />
            <div className="grid md:grid-cols-3 gap-4">
              <input
                name="price"
                type="number"
                placeholder="Price"
                className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black transition"
                onChange={update}
                required
              />
              <select
                name="listing_type"
                className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black transition"
                onChange={update}
              >
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
              <select
                name="type"
                className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black transition"
                onChange={update}
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                name="country"
                placeholder="Country"
                className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black transition"
                onChange={update}
              />
              <input
                name="state"
                placeholder="State"
                className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black transition"
                onChange={update}
              />
              <input
                name="city"
                placeholder="City"
                className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black transition"
                onChange={update}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                name="bedrooms"
                type="number"
                placeholder="Bedrooms"
                className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black transition"
                onChange={update}
              />
              <input
                name="bathrooms"
                type="number"
                placeholder="Bathrooms"
                className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black transition"
                onChange={update}
              />
              <input
                name="parking"
                type="number"
                placeholder="Parking spaces"
                className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black transition"
                onChange={update}
              />
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="furnished"
                  onChange={update}
                  className="h-4 w-4 accent-black"
                />
                Furnished
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="negotiable"
                  onChange={update}
                  className="h-4 w-4 accent-black"
                />
                Price negotiable
              </label>
            </div>
            <div>
              <p className="font-semibold mb-2">Amenities</p>
              <div className="flex flex-wrap gap-3">
                {AMENITIES.map((a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                      form.amenities.includes(a)
                        ? "bg-black text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="font-semibold mb-2">Property Images</p>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black transition"
              onChange={(e) => setImages([...e.target.files])}
            />
            {uploading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-xl shadow-lg">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
                  <p className="text-gray-700">Uploading...</p>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg hover:opacity-90 transition"
            >
              Publish Listing
            </button>
          </div>
        )}

        <div className="flex  justify-between mt-6">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 border rounded-xl hover:bg-gray-100 transition"
            >
              Back
            </button>
          )}
          {step < 2 && (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="ml-auto px-6 py-2 bg-black text-white rounded-xl hover:opacity-90 transition"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
