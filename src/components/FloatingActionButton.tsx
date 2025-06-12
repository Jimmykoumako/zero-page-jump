
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Music,
  FileText,
  Users,
  Speaker,
  LayoutDashboard,
  Book,
  Heart,
  MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const quickActions = [
  {
    title: "Browse Music",
    description: "Explore the music library",
    icon: Music,
    action: "/music",
    color: "text-green-600"
  },
  {
    title: "Manage Tracks",
    description: "Upload and organize tracks",
    icon: FileText,
    action: "/track-management",
    color: "text-blue-600"
  },
  {
    title: "Create Sync",
    description: "Start a new sync project",
    icon: LayoutDashboard,
    action: "/sync-studio",
    color: "text-purple-600"
  },
  {
    title: "Join Session",
    description: "Join a group worship session",
    icon: Users,
    action: "group",
    color: "text-orange-600"
  },
  {
    title: "Present Hymns",
    description: "Display hymns for congregation",
    icon: Speaker,
    action: "display",
    color: "text-red-600"
  },
  {
    title: "Browse Hymnals",
    description: "Explore digital hymn books",
    icon: Book,
    action: "hymnal",
    color: "text-indigo-600"
  }
];

interface FloatingActionButtonProps {
  className?: string;
}

export function FloatingActionButton({ className }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAction = (action: string) => {
    setIsOpen(false);
    
    if (action.startsWith('/')) {
      navigate(action);
    } else {
      // Handle special actions
      switch (action) {
        case 'group':
          toast({
            title: "Group Sessions",
            description: "Group session functionality coming soon!",
          });
          break;
        case 'display':
          toast({
            title: "Presentation Mode",
            description: "Presentation mode functionality coming soon!",
          });
          break;
        case 'hymnal':
          toast({
            title: "Hymn Books",
            description: "Hymn book browsing functionality coming soon!",
          });
          break;
        default:
          console.log('Unknown action:', action);
      }
    }
  };

  return (
    <TooltipProvider>
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  className={`
                    w-14 h-14 rounded-full shadow-lg hover:shadow-xl
                    bg-gradient-to-r from-blue-600 to-purple-600 
                    hover:from-blue-700 hover:to-purple-700
                    transition-all duration-300 hover:scale-110
                    ${isOpen ? 'rotate-45' : 'rotate-0'}
                  `}
                >
                  <Plus className="w-6 h-6 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="mr-4">
                <p>Quick Actions</p>
              </TooltipContent>
            </Tooltip>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            side="top" 
            align="end" 
            className="w-64 mb-4 bg-background/95 backdrop-blur-sm border-border/50"
          >
            <div className="p-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Quick Actions
              </h4>
            </div>
            
            {quickActions.map((item, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => handleAction(item.action)}
                className="flex items-start gap-3 p-3 cursor-pointer hover:bg-accent/50"
              >
                <div className={`p-2 rounded-lg bg-accent/30 ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={() => {
                setIsOpen(false);
                toast({
                  title: "Feedback",
                  description: "We'd love to hear from you! Feedback system coming soon.",
                });
              }}
              className="flex items-center gap-3 p-3 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Send Feedback</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => {
                setIsOpen(false);
                toast({
                  title: "Support Us",
                  description: "Thank you for considering supporting our mission!",
                  action: (
                    <Heart className="w-4 h-4 text-red-500" />
                  ),
                });
              }}
              className="flex items-center gap-3 p-3 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm">Support Us</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}
