
import { useState, useEffect } from "react";
import HymnBook from "@/components/HymnBook";
import RemoteControl from "@/components/RemoteControl";
import GroupSession from "@/components/GroupSession";
import HymnbookBrowser from "@/components/HymnbookBrowser";
import HymnLyricsViewer from "@/components/HymnLyricsViewer";
import AppHeader from "@/components/AppHeader";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import GettingStartedSection from "@/components/landing/GettingStartedSection";
import { useLandscapeDetection } from "@/hooks/useLandscapeDetection";

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
      <HeroSection />
      <FeaturesGrid onModeSelect={setMode} />
      <GettingStartedSection isLandscape={isLandscape} onModeSelect={setMode} />
    </div>
  );
};

export default Index;
