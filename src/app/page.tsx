import {
  Navbar,
  HeroSection,
  TrustSignals,
  PlatformIntegrations,
  PluginShowcase,
  SocialProof,
  FAQ,
  FinalCTA,
  Footer,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-warm-white">
      <Navbar />
      <main className="overflow-x-hidden">
        <HeroSection />
        <div id="platforms">
          <PlatformIntegrations />
        </div>
        <div id="plugins">
          <PluginShowcase />
        </div>
        <TrustSignals />
        <div id="testimonials">
          <SocialProof />
        </div>
        <div id="faq">
          <FAQ />
        </div>
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
