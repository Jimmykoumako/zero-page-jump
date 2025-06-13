import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
  Settings,
  Users, // Added for Group Worship
  Monitor, // Added for Presentation Mode
  Smartphone, // Added for Remote Control
  Library, // Added for Browse Hymnbooks (as in FeaturesGrid)
  Music2 as MusicIcon, // Aliased to avoid conflict if Music is used directly
  Edit3, // Added for Sync Studio (alternative to Settings if more specific)
  PlayCircle, // For last audio played
  BookOpen, // For last viewed hymn
  Zap // For last used feature (example)
} from "lucide-react";
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Adjust path if necessary
import { User as AuthUser } from '@supabase/supabase-js'; // Supabase Auth User type
import { User as UserProfile } from '@/integrations/supabase/types'; // Your custom User profile type from public.users
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';

// Removed HeroSection, FeaturesGrid, GettingStartedSection imports as they are not used in the provided snippet for AuthenticatedLanding directly, but they might be used in the full file.
// If they are used, keep them. For this change, focusing on the AuthenticatedLanding component itself.

interface AuthenticatedLandingUserProp { // Renamed to avoid conflict with Supabase User type
  id: string;
  email?: string; // email is usually part of auth user, not necessarily the one passed directly if it's just id
  // Other auth-specific details if needed, but id is primary for fetching profile
}

interface UserProfileWithAuthDetails extends UserProfile {
  // Combines your public.users profile with any essential auth details if needed
  // For now, UserProfile should suffice if it contains all displayable info
}

interface AuthenticatedLandingProps {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

interface AuthenticatedLandingProps {
  authUser: AuthenticatedLandingUserProp; // Expecting basic auth user details, primarily ID
  onModeSelect?: (mode: string) => void;
}

interface RecentActivityItem {
  id: string;
  type: 'hymn' | 'feature' | 'audio' | 'session';
  title: string;
  description?: string;
  icon: React.ElementType;
  actionLink?: string;
  actionHandler?: () => void;
  color?: string; // Optional color for card styling
}

const AuthenticatedLanding = ({ authUser, onModeSelect }: AuthenticatedLandingProps) => {
  console.log('[AuthenticatedLanding] Received authUser prop:', authUser);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log('[AuthenticatedLanding] Attempting to fetch profile for authUser.id:', authUser?.id);
      if (!authUser || !authUser.id) {
        setIsLoadingProfile(false);
        return;
      }
      setIsLoadingProfile(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('users') // Ensure this is your public."users" table name
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (fetchError) {
          console.error('[AuthenticatedLanding] Error fetching user profile from Supabase:', fetchError);
          toast.error(`Error fetching profile: ${fetchError.message}`);
          setUserProfile(null);
        } else if (data) {
          console.log('[AuthenticatedLanding] Successfully fetched userProfile:', data);
          setUserProfile(data as UserProfile);
        }
      } catch (e) {
        console.error('[AuthenticatedLanding] Unexpected error fetching profile:', e);
        toast.error('An unexpected error occurred while fetching your profile.');
        setUserProfile(null);
      }
      setIsLoadingProfile(false);
    };

    fetchUserProfile();
  }, [authUser]);

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const displayName = userProfile?.firstName || userProfile?.pseudoName || authUser?.email?.split('@')[0] || 'friend';
  const profilePictureUrl = userProfile?.profilePicture;
  console.log('[AuthenticatedLanding] Derived displayName:', displayName);
  console.log('[AuthenticatedLanding] Derived profilePictureUrl:', profilePictureUrl);

  // Placeholder data for "Jump Back In" section
  const recentActivities: RecentActivityItem[] = [
    {
      id: 'last-hymn',
      type: 'hymn',
      icon: BookOpen,
      title: "'Be Thou My Vision'",
      description: 'Continue reading page 34',
      actionHandler: () => console.log('Navigate to Be Thou My Vision, p.34'),
      color: 'bg-sky-100 hover:bg-sky-200'
    },
    {
      id: 'last-feature',
      type: 'feature',
      icon: Monitor,
      title: 'Presentation Mode',
      description: 'Resume your last session',
      actionHandler: () => handleModeSelect('display'), // Example: re-uses existing handler
      color: 'bg-purple-100 hover:bg-purple-200'
    },
    {
      id: 'last-audio',
      type: 'audio',
      icon: PlayCircle,
      title: "'Great Is Thy Faithfulness'",
      description: 'Listen again from 1:23',
      actionHandler: () => console.log('Play Great Is Thy Faithfulness from 1:23'),
      color: 'bg-green-100 hover:bg-green-200'
    }
  ];

  const authenticatedFeatures = [
    {
      id: 'hymnal', // Maps to existing 'hymnal' in handleModeSelect
      icon: Library,
      title: 'Browse Hymnbooks',
      description: 'Explore our vast collection of traditional and contemporary hymnbooks with advanced search.',
      color: 'bg-gradient-to-br from-blue-500 to-blue-700',
      badge: 'Popular',
      badgeColor: 'bg-yellow-400 text-gray-800',
      iconColor: 'text-white'
    },
    {
      id: 'music', // Maps to existing 'music' in handleModeSelect
      icon: MusicIcon, // Using aliased MusicIcon
      title: 'Audio Library',
      description: 'Listen to professionally recorded hymns with high-quality audio and multiple arrangements.',
      color: 'bg-gradient-to-br from-green-500 to-green-700',
      badge: 'New',
      badgeColor: 'bg-teal-400 text-white',
      iconColor: 'text-white'
    },
    {
      id: 'group', // Maps to existing 'group' in handleModeSelect
      icon: Users,
      title: 'Group Worship',
      description: 'Create or join synchronized sessions for unified singing across multiple devices.',
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
      iconColor: 'text-white'
    },
    {
      id: 'display', // Maps to existing 'display' in handleModeSelect
      icon: Monitor,
      title: 'Presentation Mode',
      description: 'Display hymns beautifully for congregation viewing with customizable fonts and themes.',
      color: 'bg-gradient-to-br from-purple-500 to-purple-700',
      iconColor: 'text-white'
    },
    {
      id: 'remote', // Maps to existing 'remote' in handleModeSelect
      icon: Smartphone,
      title: 'Remote Control',
      description: 'Control presentations wirelessly from your mobile device with gesture support.',
      color: 'bg-gradient-to-br from-orange-500 to-orange-700',
      iconColor: 'text-white'
    },
    {
      id: 'sync-studio', // New ID, will need to be handled in onModeSelect or page navigation
      icon: Edit3, // Using Edit3 for Sync Studio
      title: 'Sync Studio',
      description: 'Advanced tools for synchronizing lyrics with audio tracks for perfect timing.',
      color: 'bg-gradient-to-br from-red-500 to-red-700',
      badge: 'Pro',
      badgeColor: 'bg-indigo-400 text-white',
      iconColor: 'text-white'
    },
    {
      id: 'study-lyrics', // New ID
      icon: FileText,
      title: 'Study Lyrics',
      description: 'Dive deep into hymn lyrics with detailed syllable breakdowns and theological notes.',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
      iconColor: 'text-white'
    },
    {
      id: 'personal-practice', // New ID
      icon: Book, // Could use a different icon if 'Book' is too generic with 'Browse Hymnbooks'
      title: 'Personal Practice',
      description: 'Practice hymns at your own pace with guided assistance and progress tracking.',
      color: 'bg-gradient-to-br from-teal-500 to-teal-700',
      iconColor: 'text-white'
    }
  ];

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
      {/* Top navigation bar for larger screens */}
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 hidden md:block">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Book className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">HymnalApp</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Removed welcome message from here */}
            <Button variant="ghost" onClick={() => window.location.href = '/auth'}>
              Account
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile header is now handled in Index.tsx */}

      {/* Welcome Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          {isLoadingProfile ? (
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Loading your dashboard...
            </h1>
          ) : (
            <div className="flex flex-col items-center justify-center">
              {profilePictureUrl && (
                <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-lg">
                  <AvatarImage src={profilePictureUrl} alt={displayName} />
                  <AvatarFallback>{displayName?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                {getTimeOfDayGreeting()}, {displayName}!
              </h1>
            </div>
          )}
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to continue your worship experience?
          </p>
        </div>

        {/* Jump Back In Section */}
        {recentActivities.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-semibold text-gray-700 mb-8 text-center">
              Pick up where you left off
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentActivities.map(activity => (
                <Card 
                  key={activity.id} 
                  className={`shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${activity.color || 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={activity.actionHandler || (() => activity.actionLink && (window.location.href = activity.actionLink))}
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <activity.icon className="w-8 h-8 text-gray-700" />
                    <CardTitle className="text-xl text-gray-800">{activity.title}</CardTitle>
                  </CardHeader>
                  {activity.description && (
                    <CardContent>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Features Grid Section */}
        <div className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Explore Features
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Dive into the tools that enhance your worship experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {authenticatedFeatures.map((feature) => (
              <Card
                key={feature.id}
                className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer flex flex-col text-center ${feature.color?.includes('slate') || feature.color?.includes('gray') ? 'text-gray-800' : 'text-white'}`}
                onClick={() => handleModeSelect(feature.id)}
              >
                <div className={`absolute inset-0 ${feature.color || 'bg-gray-200'} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <CardContent className="relative z-10 p-6 flex flex-col items-center justify-center flex-grow">
                  {feature.badge && (
                    <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold ${feature.badgeColor || 'bg-pink-500 text-white'}`}>
                      {feature.badge}
                    </div>
                  )}
                  <feature.icon className={`w-16 h-16 mb-4 ${feature.iconColor || (feature.color?.includes('slate') || feature.color?.includes('gray') ? 'text-blue-600' : 'text-white')}`} />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm opacity-90 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
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
