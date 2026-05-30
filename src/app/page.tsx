import Nav from "./landing/Nav";
import Hero from "./landing/Hero";
import FloatingWorlds from "./landing/FloatingWorlds";
import HowItWorks from "./landing/HowItWorks";
import DashboardPreview from "./landing/DashboardPreview";
import AICompanion from "./landing/AICompanion";
import Gamification from "./landing/Gamification";
import FinalCTA from "./landing/FinalCTA";
import Footer from "./landing/Footer";

export default function LandingPage() {
  return (
    <main className="relative" style={{ background: "var(--bg)" }}>
      <Nav />
      <Hero />
      <FloatingWorlds />
      <HowItWorks />
      <DashboardPreview />
      <AICompanion />
      <Gamification />
      <FinalCTA />
      <Footer />
    </main>
  );
}
