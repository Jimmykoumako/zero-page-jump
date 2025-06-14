
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FullscreenPresentationProvider } from "@/contexts/FullscreenPresentationContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import HymnDisplayPage from "./pages/HymnDisplayPage";
import HymnViewer from "./pages/HymnViewer";
import Presentation from "./pages/Presentation";
import PresentationMode from "./pages/PresentationMode";
import RemotePage from "./pages/RemotePage";
import UserProfile from "./pages/UserProfile";
import AccountPage from "./pages/AccountPage";
import AudioBrowser from "./pages/AudioBrowser";
import AudioLibraryPage from "./pages/AudioLibraryPage";
import GroupSessionPage from "./pages/GroupSessionPage";
import HymnListPage from "./pages/HymnListPage";
import HymnbookBrowserPage from "./pages/HymnbookBrowserPage";
import TrackManagement from "./pages/TrackManagement";
import SyncStudio from "./pages/SyncStudio";
import ListeningHistory from "./pages/ListeningHistory";
import NotFound from "./pages/NotFound";
import AppSidebar from "./components/AppSidebar";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <SidebarProvider>
            <FullscreenPresentationProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="flex min-h-screen w-full">
                  <AppSidebar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/hymn/:hymnNumber" element={<HymnDisplayPage />} />
                      <Route path="/viewer" element={<HymnViewer />} />
                      <Route path="/presentation" element={<Presentation />} />
                      <Route path="/present/:sessionCode" element={<PresentationMode />} />
                      <Route path="/remote" element={<RemotePage />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/account" element={<AccountPage />} />
                      <Route path="/audio" element={<AudioBrowser />} />
                      <Route path="/audio-library" element={<AudioLibraryPage />} />
                      <Route path="/session/:sessionCode" element={<GroupSessionPage />} />
                      <Route path="/hymns" element={<HymnListPage />} />
                      <Route path="/hymnbooks" element={<HymnbookBrowserPage />} />
                      <Route path="/tracks" element={<TrackManagement />} />
                      <Route path="/sync" element={<SyncStudio />} />
                      <Route path="/history" element={<ListeningHistory />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </BrowserRouter>
            </FullscreenPresentationProvider>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
