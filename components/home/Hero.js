import Link from "next/link";

export default function HeroSection() {
  return (
    <section
  className="relative max-w-7xl mx-auto px-6 pb-20 bg-[url('/assets/bghero2.jpg')] pt-10 grid md:grid-cols-2 gap-16 items-center
             md:bg-[url('/assets/bghero.jpg')] bg-cover bg-center bg-fixed"
>

      <div className="absolute inset-0 bg-white/70 md:bg-white/60  pointer-events-none"></div>

      <div className="relative">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Find, List, and Manage Property
          <span className="block text-gray-500 mt-2">
            Without the usual stress.
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-xl">
          SummerHouse connects buyers, renters, property owners, and agents on one
          secure platform — search verified listings, book inspections, and
          close deals faster.
        </p>

        <div className="mt-8  flex flex-wrap gap-4">
          <Link
            href="/listings"
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

      <div className="relative hidden md:grid grid-cols-2 gap-6">
        <Feature
          title="Verified"
          text="Owners, agents, and listings go through moderation and KYC."
        />
        <Feature
          title="Secure"
          text="Role-based access, protected routes, and database-level security."
        />
        <Feature
          title="Smart"
          text="AI-assisted listings, search, and moderation."
        />
        <Feature
          title="Scalable"
          text="Built to support agents, teams, and large inventories."
        />
      </div>
    </section>
  );
}

function Feature({ title, text }) {
  return (
    <div className="bg-white/50 p-6 rounded-xl border backdrop-blur-sm">
      <p className="text-3xl font-bold">{title}</p>
      <p className="text-gray-700 mt-2">{text}</p>
    </div>
  );
}
