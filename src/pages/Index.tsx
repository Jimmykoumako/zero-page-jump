
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Github,
  Twitter,
  Mail,
  Book,
  ListMusic,
  LayoutDashboard,
  LucideIcon,
  Speaker,
  FileText
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useHymn } from "@/hooks/useHymn";
import { useToast } from "@/hooks/use-toast";
import AuthenticatedLanding from "@/components/landing/AuthenticatedLanding";
import UnauthenticatedLanding from "@/components/landing/UnauthenticatedLanding";
import HymnBook from "@/components/HymnBook";
import HymnLyrics from "@/components/HymnLyrics";
import GroupSession from "@/components/GroupSession";
import FullscreenDisplay from "@/components/FullscreenDisplay";
import RemoteControl from "@/components/RemoteControl";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface CardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const Index = () => {
  const [currentMode, setCurrentMode] = useState<'browse' | 'lyrics' | 'group' | 'hymnal' | 'display' | 'remote'>('browse');
  const [currentView, setCurrentView] = useState<'hymn-book' | 'hymn-lyrics' | 'group-session' | 'fullscreen-display' | 'remote-control'>('hymn-book');
  const { toast } = useToast();
  const { user, isLoading: userLoading } = useUser();
  const { isLoading: hymnLoading } = useHymn();

  const handleModeSelect = (mode: 'browse' | 'lyrics' | 'group' | 'hymnal' | 'display' | 'remote' | 'music') => {
    if (mode === 'music') {
      window.location.href = '/music';
      return;
    }
    
    setCurrentMode(mode);
    if (mode === 'browse' || mode === 'hymnal') {
      setCurrentView('hymn-book');
    } else if (mode === 'lyrics') {
      setCurrentView('hymn-lyrics');
    } else if (mode === 'group') {
      setCurrentView('group-session');
    } else if (mode === 'display') {
      setCurrentView('fullscreen-display');
    } else if (mode === 'remote') {
      setCurrentView('remote-control');
    }
  };

  if (userLoading || hymnLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <AuthenticatedLanding user={user} onModeSelect={handleModeSelect} />
      ) : (
        <UnauthenticatedLanding />
      )}

      {currentView === 'hymn-book' && <HymnBook mode="browse" deviceId="" onBack={() => {}} />}
      {currentView === 'hymn-lyrics' && <HymnLyrics />}
      {currentView === 'group-session' && <GroupSession deviceId="" onBack={() => {}} onJoinSession={() => {}} />}
      {currentView === 'fullscreen-display' && <FullscreenDisplay />}
      {currentView === 'remote-control' && <RemoteControl deviceId="" onBack={() => {}} />}
    </>
  );
};

export default Index;
