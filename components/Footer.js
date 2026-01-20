import Link from "next/link";

export default function Footer() {
  return (
<footer className="w-full mt-20 border-t bg-black text-white md:bg-white md:text-gray-600">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-bold mb-3">SummerHouse</h3>
            <p className="text-sm text-white md:text-gray-600 leading-relaxed">
              A modern marketplace for transparent property discovery, trusted
              connections, and confident deals.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/listings" className="hover:underline">
                  Explore Listings
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:underline">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/#Howitworks" className="hover:underline">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:underline">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t text-sm text-white md:text-gray-600 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>
            © {new Date().getFullYear()} WebDevii. All rights reserved.
          </span>

          
        </div>
      </div>
    </footer>
  );
}
