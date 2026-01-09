import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gray-50">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Find, List, and Manage Property  
            <span className="block text-gray-500 mt-2">
              Without the usual stress.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            RealHouse connects buyers, renters, property owners, and agents on one
            secure platform — search verified listings, book inspections, and close
            deals faster.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/search"
              className="bg-black text-white px-6 py-3 rounded-md font-medium hover:opacity-90"
            >
              Browse Properties
            </Link>

            <Link
              href="/auth/signup"
              className="border px-6 py-3 rounded-md font-medium hover:bg-white"
            >
              List Your Property
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border">
            <p className="text-3xl font-bold">Verified</p>
            <p className="text-gray-500 mt-2">
              Owners, agents, and listings go through moderation and KYC.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <p className="text-3xl font-bold">Secure</p>
            <p className="text-gray-500 mt-2">
              Role-based access, protected routes, and database-level security.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <p className="text-3xl font-bold">Smart</p>
            <p className="text-gray-500 mt-2">
              AI-assisted listings, search, and moderation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <p className="text-3xl font-bold">Scalable</p>
            <p className="text-gray-500 mt-2">
              Built to support agents, teams, and large inventories.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-12">
            How RealHouse works
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <h3 className="font-semibold text-lg">Search & Discover</h3>
              <p className="mt-3 text-gray-600">
                Find properties by location, price, type, and amenities using a
                fast, map-based search.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Connect & Inspect</h3>
              <p className="mt-3 text-gray-600">
                Chat directly with verified owners or agents and book inspections
                on your schedule.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Close with Confidence</h3>
              <p className="mt-3 text-gray-600">
                Transparent listings, moderation, and secure payments keep deals
                clean and predictable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold">
            Ready to get started?
          </h2>
          <p className="mt-4 text-gray-600">
            Create an account in minutes and access verified property listings.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/auth/signup"
              className="bg-black text-white px-8 py-3 rounded-md font-medium"
            >
              Create Account
            </Link>
            <Link
              href="/search"
              className="border px-8 py-3 rounded-md font-medium"
            >
              Explore Listings
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
