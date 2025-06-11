
import { Button } from "@/components/ui/button";
import { Book, Heart, Users, Monitor, Library, Music, ArrowRight, LogIn, UserPlus } from "lucide-react";

interface UnauthenticatedLandingProps {
  onModeSelect: (mode: 'browse' | 'lyrics' | 'group') => void;
  onAuthClick: () => void;
}

const UnauthenticatedLanding = ({ onModeSelect, onAuthClick }: UnauthenticatedLandingProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Book className="w-20 h-20 text-primary" />
                <Heart className="w-6 h-6 text-red-500 absolute -top-1 -right-1" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Welcome to Digital Hymnbook
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Empowering congregational worship with modern technology for timeless songs of praise
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Join Our Community</h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Create an account to save your preferences, join group sessions, and access exclusive features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button 
                onClick={onAuthClick}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
              <Button 
                onClick={onAuthClick}
                variant="outline" 
                size="lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required • Free forever • Join thousands of worship leaders
            </p>
          </div>

          {/* Scripture Verse */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-lg border border-white/20">
            <blockquote className="text-2xl md:text-3xl font-serif text-slate-700 italic leading-relaxed mb-4">
              "Rejoice in the LORD, O ye righteous: for praise is comely for the upright."
            </blockquote>
            <cite className="text-lg text-slate-600 font-medium">— Psalm 33:1 (KJV)</cite>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Experience Worship Like Never Before
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Try our features below, or sign up for the full experience with saved preferences and group worship.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {/* Browse Feature */}
            <div 
              onClick={() => onModeSelect('browse')}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 group"
            >
              <div className="text-center">
                <Library className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Browse Hymnbooks</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Explore our collection of traditional and contemporary hymnbooks
                </p>
                <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Try Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Lyrics Feature */}
            <div 
              onClick={() => onModeSelect('lyrics')}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 group"
            >
              <div className="text-center">
                <Music className="w-12 h-12 text-indigo-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Study Lyrics</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Dive deep into hymn lyrics with detailed syllable breakdowns
                </p>
                <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Try Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Group Feature (Preview) */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  Sign Up Required
                </span>
              </div>
              <div className="text-center opacity-75">
                <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Group Worship</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Create or join synchronized sessions for unified singing
                </p>
                <Button variant="outline" size="sm" disabled>
                  Requires Account
                </Button>
              </div>
            </div>
          </div>

          {/* Getting Started */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Lead Worship?</h3>
              <p className="text-muted-foreground mb-6 text-lg max-w-2xl mx-auto">
                Join thousands of worship leaders who trust Digital Hymnbook for their congregational singing.
                Create your free account to unlock all features.
              </p>
              <Button 
                onClick={onAuthClick}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create Free Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-4 bg-white/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Digital Hymnbook?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="bg-green-500 rounded-full p-3 flex-shrink-0">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Built for Worship Leaders</h3>
                <p className="text-muted-foreground">
                  Designed with input from worship leaders and congregations worldwide for authentic worship experiences.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-blue-500 rounded-full p-3 flex-shrink-0">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Modern Technology</h3>
                <p className="text-muted-foreground">
                  Cutting-edge features like synchronized group sessions, remote controls, and presentation modes.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-purple-500 rounded-full p-3 flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Community Focused</h3>
                <p className="text-muted-foreground">
                  Connect with other worship leaders, share sessions, and build a community around congregational praise.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-orange-500 rounded-full p-3 flex-shrink-0">
                <Library className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Rich Content</h3>
                <p className="text-muted-foreground">
                  Extensive collection of traditional and contemporary hymns with detailed lyrics and study materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UnauthenticatedLanding;
