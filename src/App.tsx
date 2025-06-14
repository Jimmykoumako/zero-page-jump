
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import HymnbookBrowserPage from "./pages/HymnbookBrowserPage";
import HymnListPage from "./pages/HymnListPage";
import HymnDisplayPage from "./pages/HymnDisplayPage";
import AudioBrowser from "./pages/AudioBrowser";
import TrackManagement from "./pages/TrackManagement";
import SyncStudio from "./pages/SyncStudio";
import ListeningHistory from "./pages/ListeningHistory";
import AccountPage from "./pages/AccountPage";
import UserProfile from "./pages/UserProfile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PresentationMode from "./pages/PresentationMode";
import RemotePage from "./pages/RemotePage";
import GroupSessionPage from "./pages/GroupSessionPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarInset className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/hymnbook" element={<HymnbookBrowserPage />} />
                <Route path="/hymnbook/:id" element={<HymnListPage />} />
                <Route path="/hymn/:id" element={<HymnDisplayPage />} />
                <Route path="/music" element={<AudioBrowser />} />
                <Route path="/track-management" element={<TrackManagement />} />
                <Route path="/sync-studio" element={<SyncStudio />} />
                <Route path="/presentation" element={<PresentationMode />} />
                <Route path="/remote" element={<RemotePage />} />
                <Route path="/group-session" element={<GroupSessionPage />} />
                <Route path="/history" element={<ListeningHistory />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <FloatingActionButton />
            </SidebarInset>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
