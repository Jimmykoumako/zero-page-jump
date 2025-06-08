
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Book, Settings, Info, Github, Monitor, LogIn, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface AppHeaderProps {
  onModeSelect?: (mode: 'select' | 'hymnal' | 'remote' | 'display' | 'browse') => void;
}

const AppHeader = ({ onModeSelect }: AppHeaderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'browse':
        onModeSelect?.('browse');
        break;
      case 'display':
        onModeSelect?.('display');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'about':
        alert('Digital Hymnbook - A modern solution for congregational singing with synchronized displays and remote controls.');
        break;
      case 'login':
        navigate('/auth');
        break;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Book className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Digital Hymnbook</h1>
              <p className="text-sm text-muted-foreground">Modern congregational singing</p>
            </div>
          </div>

          {/* Quick Actions and Auth */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('browse')}
              className="hidden sm:flex"
            >
              <Book className="w-4 h-4 mr-2" />
              Browse Hymns
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('display')}
              className="hidden sm:flex"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Quick Display
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickAction('about')}
            >
              <Info className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickAction('admin')}
            >
              <Settings className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            </Button>

            {/* Authentication Buttons */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickAction('profile')}
                      className="hidden sm:flex"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <div className="hidden md:flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction('login')}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
