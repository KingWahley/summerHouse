"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "../../../lib/supabaseClient";

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "apartment"
  });

  useEffect(() => {
    async function checkAccess() {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/auth/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!data || !["agent", "owner", "admin"].includes(data.role)) {
        alert("Only agents or owners can add properties.");
        router.replace("/dashboard");
        return;
      }

      setRole(data.role);
      setLoading(false);
    }

    checkAccess();
  }, [router]);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session?.user) {
      router.replace("/auth/login");
      return;
    }

    const { error } = await supabase.from("listings").insert({
      owner_id: session.user.id,
      title: form.title,
      description: form.description,
      price: form.price,
      type: form.type
      // 🚫 NO status here — DB decides
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  }

  if (loading) {
    return <div className="p-10 text-gray-500">Loading…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-2">
        Create Property Listing
      </h1>

      <p className="text-gray-500 mb-6">
        Your listing will be published immediately.
      </p>

      <form onSubmit={submit} className="space-y-4">
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
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          className="w-full border p-3 rounded"
          onChange={update}
          required
        />

        <select
          name="type"
          className="w-full border p-3 rounded"
          onChange={update}
        >
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="land">Land</option>
          <option value="commercial">Commercial</option>
        </select>

        <button className="bg-black text-white px-6 py-3 rounded">
          Publish Listing
        </button>
      </form>
    </div>
  );
}
