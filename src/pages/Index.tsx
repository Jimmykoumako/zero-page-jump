
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import HymnBook from "@/components/HymnBook";
import RemoteControl from "@/components/RemoteControl";
import EnhancedGroupSession from "@/components/EnhancedGroupSession";
import HymnbookBrowser from "@/components/HymnbookBrowser";
import HymnLyricsViewer from "@/components/HymnLyricsViewer";
import AppHeader from "@/components/AppHeader";
import AuthenticatedLanding from "@/components/landing/AuthenticatedLanding";
import UnauthenticatedLanding from "@/components/landing/UnauthenticatedLanding";
import { useLandscapeDetection } from "@/hooks/useLandscapeDetection";

const Index = () => {
  const [mode, setMode] = useState<'select' | 'hymnal' | 'remote' | 'display' | 'browse' | 'lyrics' | 'group'>('select');
  const [deviceId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [selectedHymnbook, setSelectedHymnbook] = useState(null);
  const [groupSession, setGroupSession] = useState<{sessionId: string, isLeader: boolean} | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isLandscape = useLandscapeDetection();
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Check URL for auto-join session code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const joinCode = urlParams.get('join');
    if (joinCode && mode === 'select') {
      setMode('group');
    }
  }, [mode]);

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
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
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

  const handleAuthClick = () => {
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (mode === 'browse') {
    return <HymnbookBrowser onBack={resetToHome} onSelectHymnbook={handleHymnbookSelect} />;
  }

  if (mode === 'lyrics') {
    return <HymnLyricsViewer onBack={resetToHome} selectedHymnbook={selectedHymnbook} />;
  }

  if (mode === 'group') {
    return (
      <EnhancedGroupSession 
        userId={userId} 
        onBack={resetToHome} 
        onJoinSession={handleJoinSession} 
      />
    );
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
      {user ? (
        <AuthenticatedLanding user={user} onModeSelect={setMode} />
      ) : (
        <UnauthenticatedLanding onModeSelect={setMode} onAuthClick={handleAuthClick} />
      )}
    </div>
  );
};

export default Index;
