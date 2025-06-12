
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Book,
  Home,
  Music,
  Settings,
  User,
  History,
  LayoutDashboard,
  Speaker,
  Users,
  FileText,
  Heart,
  HelpCircle,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/hooks/useUser";

const navigationItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Music Library",
    url: "/music",
    icon: Music,
  },
  {
    title: "Track Management",
    url: "/track-management",
    icon: FileText,
  },
  {
    title: "Sync Studio",
    url: "/sync-studio",
    icon: LayoutDashboard,
  },
  {
    title: "Listening History",
    url: "/history",
    icon: History,
  },
];

const communityItems = [
  {
    title: "Group Sessions",
    url: "#",
    icon: Users,
    badge: "Soon"
  },
  {
    title: "Presentations",
    url: "#",
    icon: Speaker,
    badge: "Soon"
  },
];

const supportItems = [
  {
    title: "Help Center",
    url: "#",
    icon: HelpCircle,
  },
  {
    title: "Support Us",
    url: "#",
    icon: Heart,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const handleNavigation = (url: string) => {
    if (url.startsWith('#')) {
      // Handle placeholder links
      return;
    }
    navigate(url);
  };

  const isActive = (url: string) => {
    if (url === "/" && location.pathname === "/") return true;
    if (url !== "/" && location.pathname.startsWith(url)) return true;
    return false;
  };

  return (
    <Sidebar className="border-r bg-card">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-lg">
            <Book className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">HymnalApp</h2>
            <p className="text-xs text-muted-foreground">Digital Worship</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.url)}
                    onClick={() => handleNavigation(item.url)}
                  >
                    <button className="w-full justify-start">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Community</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    onClick={() => handleNavigation(item.url)}
                  >
                    <button className="w-full justify-start">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    onClick={() => handleNavigation(item.url)}
                  >
                    <button className="w-full justify-start">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-accent/50">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {(user.firstName?.[0] || user.name?.[0] || user.email[0]).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.firstName || user.name || user.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <SidebarMenuButton 
                asChild
                size="sm"
                onClick={() => navigate('/profile')}
                className="flex-1"
              >
                <button>
                  <User className="w-4 h-4" />
                  Profile
                </button>
              </SidebarMenuButton>
              <SidebarMenuButton 
                asChild
                size="sm"
                onClick={() => navigate('/auth')}
                variant="outline"
                className="flex-1"
              >
                <button>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </SidebarMenuButton>
            </div>
          </div>
        ) : (
          <SidebarMenuButton 
            asChild
            onClick={() => navigate('/auth')}
          >
            <button className="w-full justify-center">
              <User className="w-4 h-4" />
              Sign In
            </button>
          </SidebarMenuButton>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
