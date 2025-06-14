
import { useState } from "react";
import { Home, Music, Users, Settings, BookOpen, Play, Headphones, FileAudio, Mic, History, Radio } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      group: "main"
    },
    {
      title: "Hymn Books",
      url: "/hymnbooks",
      icon: BookOpen,
      group: "content"
    },
    {
      title: "Hymn List",
      url: "/hymns",
      icon: Music,
      group: "content"
    },
    {
      title: "Audio Browser",
      url: "/audio",
      icon: Headphones,
      group: "audio"
    },
    {
      title: "Audio Library",
      url: "/audio-library",
      icon: FileAudio,
      group: "audio"
    },
    {
      title: "Track Manager",
      url: "/tracks",
      icon: Mic,
      group: "audio"
    },
    {
      title: "Sync Studio",
      url: "/sync",
      icon: Radio,
      group: "audio"
    },
    {
      title: "Listening History",
      url: "/history",
      icon: History,
      group: "audio"
    },
    {
      title: "Group Sessions",
      url: "/session/join",
      icon: Users,
      group: "collaboration"
    },
    {
      title: "Presentation",
      url: "/presentation",
      icon: Play,
      group: "collaboration"
    },
    {
      title: "Remote Control",
      url: "/remote",
      icon: Settings,
      group: "collaboration"
    },
  ];

  const groupedItems = menuItems.reduce((groups, item) => {
    if (!groups[item.group]) {
      groups[item.group] = [];
    }
    groups[item.group].push(item);
    return groups;
  }, {} as Record<string, typeof menuItems>);

  const groupLabels = {
    main: "Dashboard",
    content: "Content",
    audio: "Audio",
    collaboration: "Collaboration"
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg">Digital Hymnal</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {Object.entries(groupedItems).map(([groupKey, items]) => (
          <SidebarGroup key={groupKey}>
            <SidebarGroupLabel>{groupLabels[groupKey as keyof typeof groupLabels]}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => navigate(item.url)}
                      isActive={location.pathname === item.url}
                      className="w-full"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
