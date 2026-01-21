"use client";

import { useEffect, useState } from "react";
import ListingCarousel from "@/components/listings/ListingCarousel";
import { fetchPublicListings } from "@/lib/listings";
import Slider from "react-slick";
import Link from "next/link";

export default function HeroSection() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [slidesToShow, setSlidesToShow] = useState(2);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1024) {
        setSlidesToShow(1); // Mobile: 1 slide
        setAutoplay(false); // Mobile: no autoplay
      } else {
        setSlidesToShow(2); // Desktop: 2 slides
        setAutoplay(true); // Desktop: autoplay
      }
    }

    handleResize(); // Initialize on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function loadListings() {
    setLoading(true);
    try {
      const data = await fetchPublicListings({ query: "", filters: {} });
      setResults(data.slice(0, 6));
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <div>
      <section
        className="relative   bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/assets/bghero.jpg')" }}
      >
        {" "}
        <div className="relative z-10 bg-white/90   px-4 py-6 sm:py-16 sm:px-6 lg:py-24 xl:py-24 lg:flex items-center  gap-10">
          <div className="lg:w-[50%] lg:pr-8 flex flex-col justify-center">
            <div className="max-w-md mx-auto sm:max-w-lg lg:mx-0">
              <h1 className="text-3xl font-bold text-[#4478A6] sm:text-4xl lg:text-5xl">
                Find, List and Manage Property{" "}
                <span className="inline">
                  <img
                    className="inline w-auto h-8 sm:h-10 lg:h-12"
                    src="https://landingfoliocom.imgix.net/store/collection/clarity-blog/images/hero/4/shape-1.svg"
                    alt="shape-1"
                  />
                </span>{" "}
                Without the usual stress{" "}
                <span className="inline">
                  <img
                    className="inline w-auto h-8 sm:h-10 lg:h-11"
                    src="https://landingfoliocom.imgix.net/store/collection/clarity-blog/images/hero/4/shape-2.svg"
                    alt="shape-2"
                  />
                </span>
              </h1>
              <p className="mt-6 text-base font-normal leading-7 text-[#734440]">
                SummerHouse connects buyers, renters, property owners, and
                agents on one secure platform — search verified listings, book
                inspections, and close deals faster.
              </p>

              <p className="mt-8 text-base font-bold text-[#A64F03]">
                Search your desired location, price or house type
              </p>
              <form className="relative mt-4">
                <div className="absolute transition-all duration-1000 opacity-30 inset-0 bg-gradient-to-r from-[#4478A6] via-[#F28705] to-[#A64F03] rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <label htmlFor="" className="sr-only">
                      search for listings
                    </label>
                    <input
                      type="text"
                      placeholder="search for listings"
                      className="block w-full px-4 py-3 sm:py-3.5 text-base font-medium text-[#4478A6] placeholder-[#E9EFF2] border border-[#A64F03] rounded-lg sm:rounded-l-lg sm:rounded-r-none sm:text-sm focus:ring-[#4478A6] focus:border-[#4478A6]"
                    />
                  </div>
                  <Link href="/listings">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 sm:text-sm text-base sm:py-3.5 font-semibold text-[#E9EFF2] transition-all duration-200 bg-[#F28705] border border-transparent rounded-lg sm:rounded-r-lg sm:rounded-l-none hover:bg-[#A64F03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F28705]"
                    >
                      search
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <div className="w-full lg:max-w-xl lg:pl-8 lg:w-[50%] mt-8 lg:mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
              </div>
            ) : results.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No listings found
              </p>
            ) : (
              <Slider
                dots={true}
                infinite={results.length > 1}
                speed={500}
                slidesToShow={slidesToShow} // Dynamic slides
                slidesToScroll={1}
                arrows={true}
                autoplay={autoplay} // Dynamic autoplay
                autoplaySpeed={2500}
                pauseOnHover={true}
                centerMode={slidesToShow === 1} // Center only on mobile
                centerPadding="30px"
              >
                {results.slice(0, 4).map((listing) => (
                  <div key={listing.id} className="px-2 outline-none">
                    <div className="w-full">
                      <ListingCarousel listings={[listing]} />
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
