
import { Book, Heart, Play, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted?: () => void;
  onWatchDemo?: () => void;
}

const HeroSection = ({ onGetStarted, onWatchDemo }: HeroSectionProps) => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-50" />
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000" />
      
      <div className="container mx-auto text-center max-w-5xl relative z-10">
        {/* Welcome Message */}
        <div className="mb-12">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
                <Book className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-br from-red-400 to-pink-500 rounded-full">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-1 -left-1 p-1 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
              Digital Hymnbook
            </span>
            <br />
            <span className="text-4xl md:text-5xl text-muted-foreground">
              for Modern Worship
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto">
            Transform your congregation's worship experience with powerful digital tools, 
            synchronized displays, and seamless group sessions for timeless songs of praise.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              onClick={onGetStarted}
            >
              <Users className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 px-8 py-4 text-lg hover:bg-accent"
              onClick={onWatchDemo}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>1000+ Churches</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>50,000+ Hymns</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Free Forever</span>
            </div>
          </div>
        </div>

        {/* Scripture Verse */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-16 shadow-xl border border-white/40">
          <blockquote className="text-2xl md:text-3xl font-serif text-slate-700 italic leading-relaxed mb-4">
            "Rejoice in the LORD, O ye righteous: for praise is comely for the upright."
          </blockquote>
          <cite className="text-lg text-slate-600 font-medium">— Psalm 33:1 (KJV)</cite>
        </div>

        {/* Audience-Specific Welcome */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">For Worship Leaders</h3>
            <p className="text-muted-foreground leading-relaxed">
              Lead your congregation with confidence using synchronized displays, remote controls, 
              and seamless group sessions. Powerful tools designed by worship leaders, for worship leaders.
            </p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">For Congregations</h3>
            <p className="text-muted-foreground leading-relaxed">
              Join in unified worship with clear lyrics, easy navigation, and tools designed to enhance 
              your singing experience. Follow along effortlessly and focus on praise.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
