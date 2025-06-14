
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Music, 
  FileText, 
  LayoutDashboard, 
  Users, 
  Speaker, 
  Book,
  Monitor,
  User as UserIcon,
  History,
  Shield,
  Smartphone
} from "lucide-react";
import { User } from "@/types/user";

interface AuthenticatedLandingProps {
  onModeSelect: (mode: 'browse' | 'lyrics' | 'group' | 'hymnal' | 'display' | 'remote' | 'music' | 'track-manager' | 'sync') => void;
  user?: User;
}

const AuthenticatedLanding = ({ onModeSelect, user }: AuthenticatedLandingProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const quickActionCards = [
    {
      title: "Browse Music",
      description: "Explore the music library and discover new tracks",
      icon: Music,
      mode: 'music' as const,
      color: "bg-green-500",
      route: "/music"
    },
    {
      title: "Manage Tracks", 
      description: "Upload and organize your music tracks",
      icon: FileText,
      mode: 'track-manager' as const,
      color: "bg-blue-500",
      route: "/track-management"
    },
    {
      title: "Sync Studio",
      description: "Create synchronized lyric-audio experiences",
      icon: LayoutDashboard,
      mode: 'sync' as const,
      color: "bg-purple-500",
      route: "/sync-studio"
    },
    {
      title: "Presentation Mode",
      description: "Display hymns beautifully for congregation viewing",
      icon: Monitor,
      mode: 'display' as const,
      color: "bg-red-500",
      route: "/presentation"
    },
    {
      title: "Remote Control",
      description: "Control presentations remotely from your device",
      icon: Smartphone,
      mode: 'remote' as const,
      color: "bg-indigo-500",
      route: "/remote"
    },
    {
      title: "Group Sessions",
      description: "Join or create collaborative worship sessions",
      icon: Users,
      mode: 'group' as const,
      color: "bg-orange-500",
      route: "/group-session"
    },
    {
      title: "Browse Hymnals",
      description: "Explore digital hymn books and collections",
      icon: Book,
      mode: 'hymnal' as const,
      color: "bg-teal-500",
      route: "/hymnbook"
    },
    {
      title: "My Account",
      description: "View and edit your profile and account settings",
      icon: UserIcon,
      mode: null,
      color: "bg-gray-700",
      route: "/account"
    },
    {
      title: "Listening History",
      description: "See your worship and listening history",
      icon: History,
      mode: null,
      color: "bg-yellow-600",
      route: "/listening-history"
    },
    {
      title: "Admin Dashboard",
      description: "Manage hymnbooks, users, and more (admin only)",
      icon: Shield,
      mode: null,
      color: "bg-red-700",
      route: "/admin"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your digital worship companion is ready. Choose how you'd like to enhance your worship experience today.
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {quickActionCards.map((card, index) => (
            <Card 
              key={index}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-2 hover:border-purple-200"
              onClick={() => {
                if (card.route) {
                  window.location.href = card.route;
                } else if (card.mode) {
                  onModeSelect(card.mode);
                }
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${card.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-purple-600 transition-colors">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{card.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-purple-50 group-hover:border-purple-200 transition-colors"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity or Stats could go here */}
        <div className="text-center">
          <p className="text-gray-500">
            Ready to worship? Choose an option above to get started.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLanding;
