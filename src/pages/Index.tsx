
import { useState, useEffect } from "react";
import HymnBook from "@/components/HymnBook";
import RemoteControl from "@/components/RemoteControl";
import GroupSession from "@/components/GroupSession";
import HymnbookBrowser from "@/components/HymnbookBrowser";
import HymnLyricsViewer from "@/components/HymnLyricsViewer";
import AppHeader from "@/components/AppHeader";
import { useLandscapeDetection } from "@/hooks/useLandscapeDetection";
import { Button } from "@/components/ui/button";
import { Book, Smartphone, Monitor, Users, Library, FileText, Heart } from "lucide-react";

const Index = () => {
  const [mode, setMode] = useState<'select' | 'hymnal' | 'remote' | 'display' | 'browse' | 'lyrics' | 'group'>('select');
  const [deviceId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [selectedHymnbook, setSelectedHymnbook] = useState(null);
  const [groupSession, setGroupSession] = useState<{sessionId: string, isLeader: boolean} | null>(null);
  const isLandscape = useLandscapeDetection();

  // Set default mode based on orientation
  useEffect(() => {
    if (mode === 'select' && selectedHymnbook && !groupSession) {
      // When a hymnbook is selected, choose mode based on orientation
      if (isLandscape) {
        setMode('display');
      } else {
        setMode('hymnal');
      }
    }
  }, [selectedHymnbook, isLandscape, mode, groupSession]);

  const resetToHome = () => {
    setMode('select');
    setSelectedHymnbook(null);
    setGroupSession(null);
  };

  const handleHymnbookSelect = (hymnbook) => {
    setSelectedHymnbook(hymnbook);
    // Mode will be set automatically by useEffect based on orientation
  };

  const handleJoinSession = (sessionId: string, isLeader: boolean) => {
    setGroupSession({ sessionId, isLeader });
    // Automatically go to hymnal mode after joining session
    setMode('hymnal');
  };

  if (mode === 'browse') {
    return <HymnbookBrowser onBack={resetToHome} onSelectHymnbook={handleHymnbookSelect} />;
  }

  if (mode === 'lyrics') {
    return <HymnLyricsViewer onBack={resetToHome} selectedHymnbook={selectedHymnbook} />;
  }

  if (mode === 'group') {
    return <GroupSession deviceId={deviceId} onBack={resetToHome} onJoinSession={handleJoinSession} />;
  }

  if (mode === 'hymnal') {
    return (
      <HymnBook 
        mode="hymnal" 
        deviceId={deviceId} 
        onBack={resetToHome} 
        selectedHymnbook={selectedHymnbook}
        groupSession={groupSession}
      />
    );
  }

  if (mode === 'remote') {
    return <RemoteControl deviceId={deviceId} onBack={resetToHome} />;
  }

  if (mode === 'display') {
    return (
      <HymnBook 
        mode="display" 
        deviceId={deviceId} 
        onBack={resetToHome} 
        selectedHymnbook={selectedHymnbook}
        groupSession={groupSession}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AppHeader onModeSelect={setMode} />
      
      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          {/* Welcome Message */}
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

          {/* Scripture Verse */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-lg border border-white/20">
            <blockquote className="text-2xl md:text-3xl font-serif text-slate-700 italic leading-relaxed mb-4">
              "Rejoice in the LORD, O ye righteous: for praise is comely for the upright."
            </blockquote>
            <cite className="text-lg text-slate-600 font-medium">— Psalm 33:1 (KJV)</cite>
          </div>

          {/* Audience-Specific Welcome */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">For Worship Leaders</h3>
              <p className="text-muted-foreground">
                Lead your congregation with confidence using synchronized displays, remote controls, and seamless group sessions.
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">For Congregations</h3>
              <p className="text-muted-foreground">
                Join in unified worship with clear lyrics, easy navigation, and tools designed to enhance your singing experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Worship Experience
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're leading worship, practicing at home, or joining group singing, 
              we have the perfect tools for every moment of praise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div 
              onClick={() => setMode('browse')}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 group"
            >
              <div className="text-center">
                <Library className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Browse Hymnbooks</h3>
                <p className="text-muted-foreground text-sm">
                  Explore our collection of traditional and contemporary hymnbooks
                </p>
              </div>
            </div>

            <div 
              onClick={() => setMode('lyrics')}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 group"
            >
              <div className="text-center">
                <FileText className="w-12 h-12 text-indigo-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Study Lyrics</h3>
                <p className="text-muted-foreground text-sm">
                  Dive deep into hymn lyrics with detailed syllable breakdowns
                </p>
              </div>
            </div>

            <div 
              onClick={() => setMode('group')}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 group"
            >
              <div className="text-center">
                <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Group Worship</h3>
                <p className="text-muted-foreground text-sm">
                  Create or join synchronized sessions for unified singing
                </p>
              </div>
            </div>

            <div 
              onClick={() => setMode('hymnal')}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 group"
            >
              <div className="text-center">
                <Book className="w-12 h-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Personal Practice</h3>
                <p className="text-muted-foreground text-sm">
                  Practice hymns at your own pace with guided assistance
                </p>
              </div>
            </div>

            <div 
              onClick={() => setMode('display')}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 group"
            >
              <div className="text-center">
                <Monitor className="w-12 h-12 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Presentation Mode</h3>
                <p className="text-muted-foreground text-sm">
                  Display hymns for congregation or projection screens
                </p>
              </div>
            </div>

            <div 
              onClick={() => setMode('remote')}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 group"
            >
              <div className="text-center">
                <Smartphone className="w-12 h-12 text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Remote Control</h3>
                <p className="text-muted-foreground text-sm">
                  Control presentations from your mobile device
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Begin?</h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Start by browsing our hymnbook collection, or jump directly into group worship. 
              Every tool is designed to enhance the beauty of congregational praise.
            </p>
            {isLandscape && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-700">
                  <Monitor className="w-4 h-4 inline mr-2" />
                  Landscape mode detected - presentation mode will be optimized for your display.
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setMode('browse')}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Library className="w-5 h-5 mr-2" />
                Start Browsing
              </Button>
              <Button 
                onClick={() => setMode('group')}
                variant="outline" 
                size="lg"
              >
                <Users className="w-5 h-5 mr-2" />
                Join Group Session
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
