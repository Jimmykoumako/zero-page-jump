
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Github, 
  Twitter, 
  Mail, 
  Book, 
  ListMusic, 
  LayoutDashboard, 
  Speaker, 
  FileText 
} from "lucide-react";
import HeroSection from "./HeroSection";
import FeaturesGrid from "./FeaturesGrid";
import GettingStartedSection from "./GettingStartedSection";
import TestimonialsSection from "./TestimonialsSection";
import PricingSection from "./PricingSection";

interface UnauthenticatedLandingProps {
  onModeSelect?: (mode: string) => void;
  onAuthClick?: () => void;
}

const UnauthenticatedLanding = ({ onModeSelect, onAuthClick }: UnauthenticatedLandingProps) => {
  const handleAuthClick = () => {
    window.location.href = '/auth';
  };

  const handleGetStarted = () => {
    handleAuthClick();
  };

  const handleWatchDemo = () => {
    // For now, scroll to features section
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectPlan = (plan: string) => {
    if (plan === 'community') {
      handleAuthClick();
    } else {
      // For paid plans, could open contact form or payment flow
      handleAuthClick();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Book className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">HymnalApp</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleAuthClick}>
              Sign In
            </Button>
            <Button onClick={handleAuthClick}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <HeroSection onGetStarted={handleGetStarted} onWatchDemo={handleWatchDemo} />
      
      <div id="features">
        <FeaturesGrid onModeSelect={onModeSelect || (() => {})} />
      </div>
      
      <TestimonialsSection />
      <PricingSection onSelectPlan={handleSelectPlan} />
      <GettingStartedSection isLandscape={false} onModeSelect={onModeSelect || (() => {})} />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Book className="w-6 h-6" />
                <span className="text-lg font-bold">HymnalApp</span>
              </div>
              <p className="text-gray-400">
                Modern digital hymnals for worship communities worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Digital Hymn Books</li>
                <li>Group Sessions</li>
                <li>Audio Playback</li>
                <li>Remote Control</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex gap-4">
                <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Mail className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HymnalApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UnauthenticatedLanding;
