
"use client";
export default function Billing() {
  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Billing & Subscriptions</h1>
      <div className="border p-6 rounded">
        <p className="font-medium">Agent Plan</p>
        <p className="text-gray-500 mb-4">₦10,000 / month</p>
        <button className="bg-black text-white px-6 py-3 rounded">
          Subscribe
        </button>
      </div>
    </div>
  );
}
