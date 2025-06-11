
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Music } from 'lucide-react';
import EmptyStateCard from './EmptyStateCard';

interface Playlist {
  id: string;
  title: string;
  description: string;
  trackCount: number;
  coverImage?: string;
}

interface PlaylistsTabProps {
  playlists: Playlist[];
  onPlayPlaylist: (playlistId: string) => void;
}

const PlaylistsTab = ({ playlists, onPlayPlaylist }: PlaylistsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Your Playlists</h2>
        <Button className="bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl transition-all duration-200">
          Create Playlist
        </Button>
      </div>
      
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <Card key={playlist.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-lg mb-4 relative overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold truncate mb-1">{playlist.title}</h3>
                  <p className="text-sm text-muted-foreground truncate mb-1">{playlist.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {playlist.trackCount} {playlist.trackCount === 1 ? 'hymn' : 'hymns'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyStateCard
          icon={Users}
          title="No playlists yet"
          description="Create your first playlist to organize your favorite hymns."
          actionText="Create Your First Playlist"
        />
      )}
    </div>
  );
};

export default PlaylistsTab;
