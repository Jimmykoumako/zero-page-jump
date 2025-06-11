
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, TrendingUp, Users, Music } from 'lucide-react';
import BrowseTabContent from './BrowseTabContent';
import RecentTracksTab from './RecentTracksTab';
import PlaylistsTab from './PlaylistsTab';
import TrendingTab from './TrendingTab';
import type { Track } from '@/types/track';

interface Playlist {
  id: string;
  title: string;
  description: string;
  trackCount: number;
  coverImage?: string;
}

interface AudioBrowserTabsProps {
  tracks: Track[];
  playlists: Playlist[];
  filteredAndSortedTracks: Track[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentTrack?: string;
  isPlaying: boolean;
  onPlayTrack: (trackId: string) => void;
  onPlayPlaylist: (playlistId: string) => void;
}

const AudioBrowserTabs = ({
  tracks,
  playlists,
  filteredAndSortedTracks,
  searchQuery,
  setSearchQuery,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPlayPlaylist
}: AudioBrowserTabsProps) => {
  const recentTracks = tracks.slice(0, 6);

  return (
    <Tabs defaultValue="browse" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-muted/50 backdrop-blur">
        <TabsTrigger value="browse" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Music className="w-4 h-4" />
          <span className="hidden sm:inline">Browse</span>
        </TabsTrigger>
        <TabsTrigger value="recent" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Clock className="w-4 h-4" />
          <span className="hidden sm:inline">Recent</span>
        </TabsTrigger>
        <TabsTrigger value="playlists" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Playlists</span>
        </TabsTrigger>
        <TabsTrigger value="trending" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <TrendingUp className="w-4 h-4" />
          <span className="hidden sm:inline">Trending</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="browse">
        <BrowseTabContent
          tracks={filteredAndSortedTracks}
          playlists={playlists}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayTrack={onPlayTrack}
          onPlayPlaylist={onPlayPlaylist}
        />
      </TabsContent>

      <TabsContent value="recent">
        <RecentTracksTab
          recentTracks={recentTracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayTrack={onPlayTrack}
        />
      </TabsContent>

      <TabsContent value="playlists">
        <PlaylistsTab
          playlists={playlists}
          onPlayPlaylist={onPlayPlaylist}
        />
      </TabsContent>

      <TabsContent value="trending">
        <TrendingTab />
      </TabsContent>
    </Tabs>
  );
};

export default AudioBrowserTabs;
