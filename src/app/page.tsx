import HeroSection from "@/components/sections/HeroSection";
import FeatureSection1 from "@/components/sections/FeatureSection1";
import FeatureSection2 from "@/components/sections/FeatureSection2";
import FeatureSection3 from "@/components/sections/FeatureSection3";
import FeatureSection4 from "@/components/sections/FeatureSection4";
import FeatureSection5 from "@/components/sections/FeatureSection5";
import FeatureSection6 from "@/components/sections/FeatureSection6";
import AIFeatureSection from "@/components/sections/AIFeatureSection";
import DeveloperSection from "@/components/sections/DeveloperSection";
import CodeEnvironmentSection from "@/components/sections/CodeEnvironmentSection";
import EnterpriseSection from "@/components/sections/EnterpriseSection";
import CtaSection from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeatureSection1 />
      <FeatureSection2 />
      <FeatureSection3 />
      <FeatureSection4 />
      <FeatureSection5 />
      <FeatureSection6 />
      <AIFeatureSection />
      <DeveloperSection />
      <CodeEnvironmentSection />
      <EnterpriseSection />
      <CtaSection />
    </div>
  );
}
