"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function EditListingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [form, setForm] = useState({
    title: "",
    price: "",
    type: "",
    description: ""
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      loadListing();
    }
  }, [loading, user]);

  async function loadListing() {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("listings")
      .select("title, price, type, description")
      .eq("id", id)
      .eq("owner_id", user.id)
      .single();

    if (error || !data) {
      router.replace("/dashboard");
      return;
    }

    setForm(data);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from("listings")
      .update(form)
      .eq("id", id)
      .eq("owner_id", user.id);

    setSaving(false);

    if (!error) {
      router.push("/dashboard");
    } else {
      alert("Failed to update listing");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">
        Edit Listing
      </h1>

      <form
        onSubmit={handleSave}
        className="space-y-4"
      >
        <input
          className="w-full border rounded-md p-3"
          placeholder="Title"
          value={form.title}
          onChange={e =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          type="number"
          className="w-full border rounded-md p-3"
          placeholder="Price"
          value={form.price}
          onChange={e =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <textarea
          className="w-full border rounded-md p-3"
          placeholder="Description"
          rows={4}
          value={form.description}
          onChange={e =>
            setForm({
              ...form,
              description: e.target.value
            })
          }
        />

        <button
          disabled={saving}
          className="w-full bg-black text-white py-3 rounded-md font-medium"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
