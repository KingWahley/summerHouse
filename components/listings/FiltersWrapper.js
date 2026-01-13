"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Filters from "./Filters";

export default function FiltersWrapper({ filters, setFilters, onApply }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button" 
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 border px-4 py-4 rounded-md text-sm text-medium bg-white"
      >
        <SlidersHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white border rounded-xl p-4 shadow-lg z-50">
          <Filters filters={filters} setFilters={setFilters} />

          <button
            type="button"
            onClick={() => {
              onApply(); 
              setOpen(false);
            }}
            className="w-full mt-4 bg-black text-white py-2 rounded-md text-sm font-medium"
          >
            Apply filters
          </button>
        </div>
      )}
    </div>
  );
}
