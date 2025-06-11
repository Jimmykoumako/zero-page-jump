
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Download, Share2 } from 'lucide-react';
import PlaylistCard from '@/components/PlaylistCard';
import TrackList from '@/components/TrackList';
import AudioBrowserStats from './AudioBrowserStats';
import type { Track } from '@/types/track';

interface Playlist {
  id: string;
  title: string;
  description: string;
  trackCount: number;
  coverImage?: string;
}

interface BrowseTabContentProps {
  tracks: Track[];
  playlists: Playlist[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentTrack?: string;
  isPlaying: boolean;
  onPlayTrack: (trackId: string) => void;
  onPlayPlaylist: (playlistId: string) => void;
}

const BrowseTabContent = ({
  tracks,
  playlists,
  searchQuery,
  setSearchQuery,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPlayPlaylist
}: BrowseTabContentProps) => {
  const featuredPlaylists = playlists.slice(0, 4);

  return (
    <div className="space-y-8">
      <AudioBrowserStats
        trackCount={tracks.length}
        playlistCount={playlists.length}
        favoriteCount={0}
      />

      {featuredPlaylists.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Playlists</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                title={playlist.title}
                description={playlist.description}
                trackCount={playlist.trackCount}
                coverImage={playlist.coverImage}
                onPlay={() => onPlayPlaylist(playlist.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {searchQuery ? `Search Results` : 'All Tracks'}
            </h2>
            <p className="text-muted-foreground">
              {tracks.length} tracks available
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
        
        {tracks.length > 0 ? (
          <TrackList
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={onPlayTrack}
          />
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                <Music className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? 'No tracks found' : 'No tracks available'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? 'Try adjusting your search terms or browse all available content.'
                  : 'Upload some audio files to get started with your music library.'
                }
              </p>
              {searchQuery && (
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BrowseTabContent;
