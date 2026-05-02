import PageWrapper from "@/components/Container/PageWrapper";
import HeroSection from "@/components/LandingPage/HeroSection";
import PortabilitySection from "@/components/LandingPage/PortabilitySection";
import EditorSection from "@/components/LandingPage/EditorSection";
import AnalyticsSection from "@/components/LandingPage/AnalyticsSection";
import SEOSection from "@/components/LandingPage/SEOSection";

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <EditorSection />
      <AnalyticsSection />
      <SEOSection />
      <PortabilitySection />
    </PageWrapper>
  );
}
