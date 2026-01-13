import Link from "next/link";

export default function GetStarted() {
  return (
    <div className="bg-gray-100 border-t  md:bg-[url('/assets/bghero.jpg')] bg-cover bg-center bg-fixed">
      
      <div className="max-w-7xl  mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">Ready to get started?</h2>
        <p className="mt-4 text-gray-600">
          Create an account in minutes and access verified property listings.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/auth/signup"
            className="
    bg-black text-white px-2  text-sm md:px-8 py-3 rounded-md font-medium
    transition-all duration-200 ease-out
    hover:-translate-y-0.5 hover:shadow-lg
    active:translate-y-0 active:shadow-md
  "
          >
            Create Account
          </Link>

          <Link
            href="/listings"
            className="
    borderpx-2 md:px-8 py-3 text-sm rounded-md font-medium
    transition-all duration-200 ease-out
    hover:-translate-y-0.5 hover:bg-black hover:text-white
    active:translate-y-0
  "
          >
            Explore Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
