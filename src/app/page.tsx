import Nav from "./landing/Nav";
import Hero from "./landing/Hero";
import InAppDemo from "./landing/InAppDemo";
import LearningTree from "./landing/LearningTree";
import StreakEngine from "./landing/StreakEngine";
import Transformation from "./landing/Transformation";
import BottomCTA from "./landing/BottomCTA";
import Footer from "./landing/Footer";
import SoundToggle from "./landing/components/SoundToggle";
import SmoothScroller from "./landing/components/SmoothScroller";
import GlobalMascot from "./landing/GlobalMascot";

export default function LandingPage() {
  return (
    <SmoothScroller>
      <main className="relative overflow-hidden" style={{ background: "#E8F5E0" }}>
        <GlobalMascot />
        <SoundToggle />
        <Nav />
        <Hero />
        <InAppDemo />
        <LearningTree />
        <StreakEngine />
        <Transformation />
        <BottomCTA />
        <Footer />
      </main>
    </SmoothScroller>
  );
}
