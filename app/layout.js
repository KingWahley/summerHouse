import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata = {
  title: {
    default: "SummerHouse",
    template: "%s | RealHouse"
  },
  description:
    "Find, rent, and sell verified properties with trusted agents and owners.",
  applicationName: "SummerHouse",
  keywords: [
    "real estate",
    "property",
    "rent",
    "buy house",
    "apartments",
    "realhouse"
  ],
  authors: [{ name: "WebDevii" }],
  metadataBase: new URL("https://summer-house-bay.vercel.app/"),
  openGraph: {
    title: "SummerHouse",
    description:
      "A secure marketplace for buying, renting, and listing properties.",
    siteName: "SummerHouse",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
