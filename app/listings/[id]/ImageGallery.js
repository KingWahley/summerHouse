"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({ images }) {
  const containerRef = useRef(null);
  const [active, setActive] = useState(0);

  function scrollTo(index) {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    containerRef.current.scrollTo({
      left: width * index,
      behavior: "smooth"
    });
    setActive(index);
  }

  function handleScroll(e) {
    const width = e.target.offsetWidth;
    setActive(Math.round(e.target.scrollLeft / width));
  }

  if (!images || images.length === 0) {
    return (
      <div className="rounded-3xl border border-[#e7dfd2] bg-white/80 p-10 text-center shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#9b9489]">
          Gallery
        </p>
        <h3 className="text-2xl font-semibold text-[#2b2a27] mt-3">
          No images available.
        </h3>
        <p className="text-sm text-[#5b5a56] mt-2">
          Check back soon for updated photos.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#e7dfd2] bg-white/80 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,#f3e6d1,transparent_60%),radial-gradient(circle_at_10%_70%,#dde6f5,transparent_55%)] opacity-70" />

      <div className="absolute top-4 left-4 z-20 rounded-full border border-[#e7dfd2] bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#2b2a27]">
        Photos
      </div>
      <div className="absolute top-4 right-4 z-20 rounded-full border border-[#e7dfd2] bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#2b2a27]">
        {active + 1} / {images.length}
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative z-10 flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing"
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            draggable={false}
            className="w-full h-[300px] md:h-[480px] lg:h-[560px] object-cover snap-start select-none"
          />
        ))}
      </div>

      <button
        onClick={() => scrollTo(active - 1)}
        disabled={active === 0}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-10 w-10 rounded-full border transition ${
          active === 0
            ? "border-[#e7dfd2] bg-white/50 text-[#c2b8aa] cursor-not-allowed"
            : "border-[#e7dfd2] bg-white/90 text-[#2b2a27] hover:bg-white"
        }`}
        aria-label="Previous image"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={() => scrollTo(active + 1)}
        disabled={active === images.length - 1}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-10 w-10 rounded-full border transition ${
          active === images.length - 1
            ? "border-[#e7dfd2] bg-white/50 text-[#c2b8aa] cursor-not-allowed"
            : "border-[#e7dfd2] bg-white/90 text-[#2b2a27] hover:bg-white"
        }`}
        aria-label="Next image"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? "bg-[#2b2a27] w-8" : "bg-[#cfc6b8] w-2.5"
            }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
