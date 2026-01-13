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
      behavior: "smooth",
    });
    setActive(index);
  }

  function handleScroll(e) {
    const width = e.target.offsetWidth;
    setActive(Math.round(e.target.scrollLeft / width));
  }

  return (
    <div className="relative group overflow-hidden rounded-none md:rounded-2xl">
      <div className="pointer-events-none hidden md:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/40 to-transparent z-10" />
      <div className="pointer-events-none hidden md:block absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/40 to-transparent z-10" />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing"
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            draggable={false}
            className="
              w-full 
              h-[280px] 
              md:h-[460px] 
              lg:h-[520px]
              object-cover 
              snap-start 
              select-none
            "
          />
        ))}
      </div>

      <button
        onClick={() => scrollTo(active - 1)}
        disabled={active === 0}
        className={`
    absolute left-3 top-1/2 -translate-y-1/2 z-20
    flex items-center justify-center
    w-9 h-9 md:w-10 md:h-10
    rounded-full backdrop-blur
    transition-all duration-200

    md:opacity-0 md:group-hover:opacity-100

    ${
      active === 0
        ? "bg-black/20 text-white/40 cursor-not-allowed"
        : "bg-black/60 text-white hover:bg-black/80 md:hover:scale-105"
    }
  `}
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={() => scrollTo(active + 1)}
        disabled={active === images.length - 1}
        className={`
    absolute right-3 top-1/2 -translate-y-1/2 z-20
    flex items-center justify-center
    w-9 h-9 md:w-10 md:h-10
    rounded-full backdrop-blur
    transition-all duration-200

    md:opacity-0 md:group-hover:opacity-100

    ${
      active === images.length - 1
        ? "bg-black/20 text-white/40 cursor-not-allowed"
        : "bg-black/60 text-white hover:bg-black/80 md:hover:scale-105"
    }
  `}
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`
              rounded-full transition-all
              ${i === active ? "bg-white w-6" : "bg-white/40 w-2.5"}
              h-2.5
            `}
          />
        ))}
      </div>
    </div>
  );
}
