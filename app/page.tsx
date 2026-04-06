import PageWrapper from "@/components/Container/PageWrapper";
import HeroSection from "@/components/LandingPage/HeroSection";
import LogoAnimation from "@/components/LandingPage/LogoAnimation";

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      {/* <div className="flex flex-col mb-40 mt-16">
        <MarketingCards />
      </div> */}
      {/* <LogoAnimation /> */}
    </PageWrapper>
  );
}
