import PageWrapper from "@/components/Container/PageWrapper";
import HeroSection from "@/components/LandingPage/HeroSection";
import PortabilitySection from "@/components/LandingPage/PortabilitySection";
import EditorSection from "@/components/LandingPage/EditorSection";

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <EditorSection />
      <PortabilitySection />
    </PageWrapper>
  );
}
