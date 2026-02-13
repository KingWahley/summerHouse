"use client";

import { useEffect, useRef, useState } from "react";
import ListingCard from "./ListingCard";

export default function ListingCarousel({ listings, className = "" }) {
  const trackRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!trackRef.current || listings.length < 2) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return;

    let animationFrame = 0;
    const speed = 0.4;

    const step = () => {
      if (!trackRef.current) return;
      if (!isPaused) {
        trackRef.current.scrollLeft += speed;
        if (
          trackRef.current.scrollLeft + trackRef.current.clientWidth >=
          trackRef.current.scrollWidth
        ) {
          trackRef.current.scrollLeft = 0;
        }
      }
      animationFrame = window.requestAnimationFrame(step);
    };

    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [isPaused, listings.length]);

  if (listings.length === 0) {
    return (
      <div className="rounded-3xl border border-[#e7dfd2] bg-white/70 p-8 text-center">
        <p className="text-sm text-[#5b5a56]">No listings found.</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="min-w-[260px] sm:min-w-[300px] lg:min-w-[320px] snap-start"
          >
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  );
}
