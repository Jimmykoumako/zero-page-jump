
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
