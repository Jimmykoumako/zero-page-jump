
import { Button } from "@/components/ui/button";
import { Book, Settings, Info, Github, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  onModeSelect?: (mode: 'select' | 'hymnal' | 'remote' | 'display' | 'browse') => void;
}

const AppHeader = ({ onModeSelect }: AppHeaderProps) => {
  const navigate = useNavigate();

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
      case 'about':
        // Show about info
        alert('Digital Hymnbook - A modern solution for congregational singing with synchronized displays and remote controls.');
        break;
    }
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

          {/* Quick Actions */}
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
