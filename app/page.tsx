import PageWrapper from "@/components/Container/PageWrapper";
import HeroSection from "@/components/LandingPage/HeroSection";
import PortabilitySection from "@/components/LandingPage/PortabilitySection";

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <PortabilitySection />
    </PageWrapper>
  );
}
