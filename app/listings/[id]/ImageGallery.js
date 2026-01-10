"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({ images }) {
  const containerRef = useRef(null);
  const [active, setActive] = useState(0);

  function scrollTo(index) {
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

  return (
    <div className="relative overflow-hidden">
      {/* IMAGES */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        onScroll={handleScroll}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-full h-[280px] md: h-[380px] object-cover snap-start select-none"
            alt=""
          />
        ))}
      </div>

      {/* LEFT ARROW */}
      <button
        onClick={() => scrollTo(active - 1)}
        disabled={active === 0}
        className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur transition
          ${
            active === 0
              ? "bg-black/20 text-white/40 cursor-not-allowed"
              : "bg-black/50 text-white hover:bg-black/70"
          }`}
      >
        <ChevronLeft size={18} />
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={() => scrollTo(active + 1)}
        disabled={active === images.length - 1}
        className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur transition
          ${
            active === images.length - 1
              ? "bg-black/20 text-white/40 cursor-not-allowed"
              : "bg-black/50 text-white hover:bg-black/70"
          }`}
      >
        <ChevronRight size={18} />
      </button>

      {/* DOT INDICATORS */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition ${
              i === active ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
