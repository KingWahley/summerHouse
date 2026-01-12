"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    title: "Search & Discover",
    text: "Find properties by location, price, type, and amenities using a fast, map-based search.",
  },
  {
    title: "Connect & Inspect",
    text: "Chat directly with verified owners or agents and book inspections on your schedule.",
  },
  {
    title: "Close with Confidence",
    text: "Transparent listings, moderation, and secure payments keep deals clean and predictable.",
  },
];

export default function HowItWorks() {
  const containerRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!containerRef.current) return;

      const next = (active + 1) % steps.length;
      const width = containerRef.current.offsetWidth;

      containerRef.current.scrollTo({
        left: width * next,
        behavior: "smooth",
      });

      setActive(next);
    }, 4000);

    return () => clearInterval(interval);
  }, [active]);

  const handleScroll = () => {
    const width = containerRef.current.offsetWidth;
    const index = Math.round(containerRef.current.scrollLeft / width);
    setActive(index);
  };

  return (
    <div id="Howitworks" className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className=" text-2xl md:text-3xl text-center md:text-left font-bold mb-12">How SummerHouse works</h2>

        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="
    no-scrollbar
    flex overflow-x-auto scroll-smooth snap-x snap-mandatory
    md:grid md:grid-cols-3 md:overflow-visible
  "
        >
          {steps.map((step, i) => (
            <div key={i} className="min-w-full snap-center md:min-w-0 px-1">
              <Step {...step} />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition ${
                active === i ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Step({ title, text }) {
  return (
    <div className="p-6">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-3 text-gray-600">{text}</p>
    </div>
  );
}
