
"use client";

import { useEffect, useState } from "react";

export default function HowItWorks() {
  const steps = [
    {
      title: "Search & Discover",
      description:
        "Find properties by location, price, type, and amenities using a fast, map-based search.",
    },
    {
      title: "Connect & Inspect",
      description:
        "Chat directly with verified owners or agents and book inspections on your schedule.",
    },
    {
      title: "Close with Confidence",
      description:
        "Transparent listings, moderation, and secure payments keep deals clean and predictable.",
    },
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide every 3s on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="py-10 bg-[#E9EFF2] sm:py-16 lg:py-16">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-[#4478A6] sm:text-4xl lg:text-5xl">
            How does it work?
          </h2>
          <p className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-[#734440]">
            Finding a home with SummerHouse is a seamless process
          </p>
        </div>

        <div className="relative mt-12 lg:mt-20">
          <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
            <img
              className="w-full"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg"
              alt=""
            />
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full text-center px-4"
                >
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-[#E9EFF2] border-2 border-[#A64F03] rounded-full shadow">
                    <span className="text-xl font-semibold text-[#F28705]">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold leading-tight text-[#4478A6] md:mt-10">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-base text-[#734440]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-3 text-center gap-y-12 gap-x-12">
            {steps.map((step, index) => (
              <div key={index}>
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-[#E9EFF2] border-2 border-[#A64F03] rounded-full shadow">
                  <span className="text-xl font-semibold text-[#F28705]">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold leading-tight text-[#4478A6] md:mt-10">
                  {step.title}
                </h3>
                <p className="mt-4 text-base text-[#734440]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
