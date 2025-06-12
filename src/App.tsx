
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { useUser } from "@/hooks/useUser";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import UserProfile from "./pages/UserProfile";
import AudioBrowser from "./pages/AudioBrowser";
import ListeningHistory from "./pages/ListeningHistory";
import TrackManagement from "./pages/TrackManagement";
import SyncStudio from "./pages/SyncStudio";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { user, isLoading } = useUser();
  const location = useLocation();
  
  // Don't show sidebar and FAB on landing page for non-signed-in users
  const isLandingPageForGuest = location.pathname === "/" && !user && !isLoading;
  const shouldShowSidebarAndFAB = !isLandingPageForGuest;

  if (shouldShowSidebarAndFAB) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/music" element={<AudioBrowser />} />
              <Route path="/history" element={<ListeningHistory />} />
              <Route path="/track-management" element={<TrackManagement />} />
              <Route path="/sync-studio" element={<SyncStudio />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <FloatingActionButton />
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  // Landing page for non-signed-in users (no sidebar or FAB)
  return (
    <div className="min-h-screen w-full">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/music" element={<AudioBrowser />} />
        <Route path="/history" element={<ListeningHistory />} />
        <Route path="/track-management" element={<TrackManagement />} />
        <Route path="/sync-studio" element={<SyncStudio />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
