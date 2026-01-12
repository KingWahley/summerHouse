import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/Howitworks";
import GetStarted from "@/components/home/Getstarted";

export default function Home() {
  return (
    <main className="bg-gray-50">
      <HeroSection />
      <HowItWorks />
      <GetStarted />

    </main>
  );
}
