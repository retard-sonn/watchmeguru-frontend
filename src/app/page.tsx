import Nav from "./landing/Nav";
import Hero from "./landing/Hero";
import WhatsAppDemo from "./landing/WhatsAppDemo";
import LearningTree from "./landing/LearningTree";
import StreakEngine from "./landing/StreakEngine";
import Transformation from "./landing/Transformation";
import BottomCTA from "./landing/BottomCTA";
import Footer from "./landing/Footer";

export default function LandingPage() {
  return (
    <main className="relative" style={{ background: "#F4EEDB" }}>
      <Nav />
      <Hero />
      <WhatsAppDemo />
      <LearningTree />
      <StreakEngine />
      <Transformation />
      <BottomCTA />
      <Footer />
    </main>
  );
}
