
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Github,
  Twitter,
  Mail,
  Book,
  ListMusic,
  LayoutDashboard,
  LucideIcon,
  Speaker,
  FileText,
  Menu
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useHymn } from "@/hooks/useHymn";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import AuthenticatedLanding from "@/components/landing/AuthenticatedLanding";
import UnauthenticatedLanding from "@/components/landing/UnauthenticatedLanding";
import TestAdminUtils from "@/components/TestAdminUtils";

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
  const location = useLocation();

  // Check if we should show the sidebar trigger (only when sidebar is available)
  const isLandingPageForGuest = location.pathname === "/" && !user && !userLoading;
  const shouldShowSidebarTrigger = !isLandingPageForGuest;

  const handleModeSelect = (mode: 'browse' | 'lyrics' | 'group' | 'hymnal' | 'display' | 'remote' | 'music' | 'track-manager' | 'sync') => {
    console.log('Mode selected:', mode);
    
    // Navigate to the appropriate route instead of changing views
    switch (mode) {
      case 'music':
        navigate('/music');
        break;
      case 'track-manager':
        navigate('/track-management');
        break;
      case 'sync':
        navigate('/sync-studio');
        break;
      case 'display':
        navigate('/presentation');
        break;
      case 'group':
        // For now, just show a toast since group sessions might need special handling
        toast({
          title: "Group Sessions",
          description: "Group session functionality coming soon!",
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
        navigate('/hymnbook');
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
    <div className="min-h-screen">
      {/* Mobile header with sidebar trigger - only show when sidebar is available */}
      {shouldShowSidebarTrigger && (
        <div className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Book className="w-6 h-6 text-primary" />
            <span className="font-semibold">HymnalApp</span>
          </div>
        </div>
      )}

      {user ? (
        <div>
          <AuthenticatedLanding onModeSelect={handleModeSelect} user={user} />
          {/* Show the admin utility for logged-in users */}
          <TestAdminUtils />
        </div>
      ) : (
        <UnauthenticatedLanding onModeSelect={handleModeSelect} onAuthClick={() => navigate('/auth')} />
      )}
    </div>
  );
};

export default Index;
