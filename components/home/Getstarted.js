import Link from "next/link";

export default function GetStarted() {
  return (
    <section className="relative overflow-hidden bg-[#1f1d1a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#514b43,transparent_55%),radial-gradient(circle_at_20%_70%,#2a2830,transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#c5beb2]">
              Ready to start
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mt-4">
              Create an account in minutes and start touring verified homes.
            </h2>
            <p className="text-base text-[#cfc8bd] mt-4 max-w-xl">
              Get alerts, save favorites, and work directly with trusted owners
              and agents.
            </p>
          </div>

          <div className="rounded-3xl border border-[#3a3530] bg-white/5 p-8">
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#4a433d] bg-[#2a2622] px-4 py-3 text-sm text-[#d2cbc0]">
                Set up your profile, verification, and preferences.
              </div>
              <div className="rounded-2xl border border-[#4a433d] bg-[#2a2622] px-4 py-3 text-sm text-[#d2cbc0]">
                Save listings and book inspections in one place.
              </div>
              <div className="rounded-2xl border border-[#4a433d] bg-[#2a2622] px-4 py-3 text-sm text-[#d2cbc0]">
                Track communication with owners and agents.
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#1f1d1a] transition hover:bg-[#e8e2d7]"
              >
                Create account
              </Link>
              <Link
                href="/listings"
                className="rounded-full border border-[#6a5f55] px-6 py-2.5 text-sm font-semibold text-white transition hover:border-white"
              >
                Explore listings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
