
import { useState, useEffect } from "react";
import HymnBook from "@/components/HymnBook";
import RemoteControl from "@/components/RemoteControl";
import GroupSession from "@/components/GroupSession";
import HymnbookBrowser from "@/components/HymnbookBrowser";
import HymnLyricsViewer from "@/components/HymnLyricsViewer";
import AppHeader from "@/components/AppHeader";
import { useLandscapeDetection } from "@/hooks/useLandscapeDetection";
import { Button } from "@/components/ui/button";
import { Book, Smartphone, Monitor, Users, Library, FileText } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AppHeader onModeSelect={setMode} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Book className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            Digital Hymnbook
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Experience the beauty of congregational singing with modern technology. 
            Perfect for worship, practice, and group singing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div 
            onClick={() => setMode('browse')}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200 group"
          >
            <div className="text-center">
              <Library className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Browse Hymnbooks</h3>
              <p className="text-slate-600 text-sm">
                Explore our collection of digital hymnbooks
              </p>
            </div>
          </div>

          <div 
            onClick={() => setMode('lyrics')}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200 group"
          >
            <div className="text-center">
              <FileText className="w-12 h-12 text-indigo-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Lyrics Viewer</h3>
              <p className="text-slate-600 text-sm">
                View detailed hymn lyrics with syllable breakdowns
              </p>
            </div>
          </div>

          <div 
            onClick={() => setMode('group')}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200 group"
          >
            <div className="text-center">
              <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Group Session</h3>
              <p className="text-slate-600 text-sm">
                Create or join synchronized group sessions
              </p>
            </div>
          </div>

          <div 
            onClick={() => setMode('hymnal')}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200 group"
          >
            <div className="text-center">
              <Book className="w-12 h-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Solo Practice</h3>
              <p className="text-slate-600 text-sm">
                Practice hymns at your own pace with karaoke-style guidance
              </p>
            </div>
          </div>

          <div 
            onClick={() => setMode('display')}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200 group"
          >
            <div className="text-center">
              <Monitor className="w-12 h-12 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Presentation Mode</h3>
              <p className="text-slate-600 text-sm">
                Display hymns for group singing or projection
              </p>
            </div>
          </div>

          <div 
            onClick={() => setMode('remote')}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200 group"
          >
            <div className="text-center">
              <Smartphone className="w-12 h-12 text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Remote Control</h3>
              <p className="text-slate-600 text-sm">
                Control the presentation from your phone or tablet
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
            <h4 className="text-lg font-semibold text-slate-800 mb-2">How it works</h4>
            <p className="text-slate-600">
              Browse hymnbooks to explore our collection, use Group Sessions for synchronized worship, 
              Solo Practice to learn hymns, Presentation Mode for group singing, and Remote Control to manage displays.
              {isLandscape && <span className="block mt-2 text-sm text-blue-600">Landscape mode detected - presentation mode will be default for hymn viewing.</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
