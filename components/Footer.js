import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#e7dfd2] bg-[#1f1d1a] text-[#d5cfc4]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#c2b8aa]">
              SummerHouse
            </p>
            <h3 className="text-2xl font-semibold text-white mt-4">
              A calmer, verified marketplace for property discovery.
            </h3>
            <p className="text-sm text-[#bdb5a9] mt-4 leading-relaxed max-w-sm">
              Search, compare, and schedule inspections in one secure platform
              built for clarity and confidence.
            </p>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[0.25em] text-[#c2b8aa]">
              Product
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/listings" className="hover:text-white">
                  Explore Listings
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-white">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/#Howitworks" className="hover:text-white">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[0.25em] text-[#c2b8aa]">
              Company
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[0.25em] text-[#c2b8aa]">
              Legal
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#3a3530] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#bdb5a9]">
          <span>© {new Date().getFullYear()} WebDevii. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-white">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
