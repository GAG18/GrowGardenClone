import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeatureCards from "@/components/feature-cards";
import LiveStocks from "@/components/live-stocks";
import TradingInterface from "@/components/trading-interface";
import TrustedPartners from "@/components/trusted-partners";
import GameGuide from "@/components/game-guide";
import FAQSection from "@/components/faq-section";
import DiscordCTA from "@/components/discord-cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <FeatureCards />
      <LiveStocks />
      <TradingInterface />
      <TrustedPartners />
      <GameGuide />
      <FAQSection />
      <DiscordCTA />
      <Footer />
    </div>
  );
}
