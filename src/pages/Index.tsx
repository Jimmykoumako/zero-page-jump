
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
import { useNavigate } from "react-router-dom";
import AuthenticatedLanding from "@/components/landing/AuthenticatedLanding";
import UnauthenticatedLanding from "@/components/landing/UnauthenticatedLanding";

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
  const { toast } = useToast();
  const { user, isLoading: userLoading } = useUser();
  const { isLoading: hymnLoading } = useHymn();
  const navigate = useNavigate();

  const handleModeSelect = (mode: 'browse' | 'lyrics' | 'group' | 'hymnal' | 'display' | 'remote' | 'music' | 'track-manager') => {
    console.log('Mode selected:', mode);
    
    // Navigate to the appropriate route instead of changing views
    switch (mode) {
      case 'music':
        navigate('/music');
        break;
      case 'track-manager':
        navigate('/track-management');
        break;
      case 'group':
        // For now, just show a toast since group sessions might need special handling
        toast({
          title: "Group Sessions",
          description: "Group session functionality coming soon!",
        });
        break;
      case 'display':
        // For now, just show a toast since fullscreen display might need special handling
        toast({
          title: "Presentation Mode",
          description: "Presentation mode functionality coming soon!",
        });
        break;
      case 'remote':
        // For now, just show a toast since remote control might need special handling
        toast({
          title: "Remote Control",
          description: "Remote control functionality coming soon!",
        });
        break;
      case 'browse':
      case 'hymnal':
        // For now, just show a toast since hymn browsing might need special handling
        toast({
          title: "Hymn Books",
          description: "Hymn book browsing functionality coming soon!",
        });
        break;
      case 'lyrics':
        // For now, just show a toast since lyrics viewing might need special handling
        toast({
          title: "Hymn Lyrics",
          description: "Hymn lyrics functionality coming soon!",
        });
        break;
      default:
        console.log('Unknown mode:', mode);
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
        <UnauthenticatedLanding onModeSelect={handleModeSelect} onAuthClick={() => navigate('/auth')} />
      )}
    </>
  );
};

export default Index;
