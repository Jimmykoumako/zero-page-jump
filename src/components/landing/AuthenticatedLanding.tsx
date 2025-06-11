import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Github, 
  Twitter, 
  Mail, 
  Book, 
  ListMusic, 
  LayoutDashboard, 
  Speaker, 
  FileText,
  Music2,
  Settings
} from "lucide-react";
import HeroSection from "./HeroSection";
import FeaturesGrid from "./FeaturesGrid";
import GettingStartedSection from "./GettingStartedSection";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

interface AuthenticatedLandingProps {
  user: User;
  onModeSelect?: (mode: string) => void;
}

const AuthenticatedLanding = ({ user, onModeSelect }: AuthenticatedLandingProps) => {
  const handleModeSelect = (mode: string) => {
    if (mode === 'music') {
      window.location.href = '/music';
    } else if (mode === 'track-manager') {
      window.location.href = '/track-management';
    } else if (onModeSelect) {
      onModeSelect(mode);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Book className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">HymnalApp</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user.firstName || user.name || user.email}
            </span>
            <Button variant="ghost" onClick={() => window.location.href = '/auth'}>
              Account
            </Button>
          </div>
        </div>
      </nav>

      {/* Welcome Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome back to HymnalApp
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Continue your worship experience with our digital hymnal platform
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleModeSelect('hymnal')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-6 h-6 text-blue-600" />
                Hymn Books
              </CardTitle>
              <CardDescription>
                Browse and read digital hymn collections
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleModeSelect('music')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListMusic className="w-6 h-6 text-green-600" />
                Music Library
              </CardTitle>
              <CardDescription>
                Listen to hymns and worship music
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleModeSelect('track-manager')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music2 className="w-6 h-6 text-purple-600" />
                Track Manager
              </CardTitle>
              <CardDescription>
                Manage your music tracks with metadata
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleModeSelect('group')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-orange-600" />
                Group Sessions
              </CardTitle>
              <CardDescription>
                Lead or join synchronized worship sessions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleModeSelect('display')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Speaker className="w-6 h-6 text-red-600" />
                Presentation
              </CardTitle>
              <CardDescription>
                Display hymns for congregation viewing
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleModeSelect('remote')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-gray-600" />
                Remote Control
              </CardTitle>
              <CardDescription>
                Control presentations remotely
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent hymnal usage and sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              Start using the app to see your recent activity here.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Book className="w-6 h-6" />
                <span className="text-lg font-bold">HymnalApp</span>
              </div>
              <p className="text-gray-400">
                Modern digital hymnals for worship communities worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Digital Hymn Books</li>
                <li>Group Sessions</li>
                <li>Audio Playback</li>
                <li>Remote Control</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex gap-4">
                <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Mail className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HymnalApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthenticatedLanding;
