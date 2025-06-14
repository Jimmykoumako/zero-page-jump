
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Plus } from 'lucide-react';
import TrackCard from '@/components/TrackCard';
import type { Track } from '@/types/track';

interface TrackGridProps {
  tracks: Track[];
  searchQuery: string;
  onEditTrack: (track: Track) => void;
  onDeleteTrack: (trackId: string) => void;
  onCreateTrack: () => void;
}

const TrackGrid = ({ tracks, searchQuery, onEditTrack, onDeleteTrack, onCreateTrack }: TrackGridProps) => {
  return (
    <div className="container mx-auto px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {searchQuery ? `Search Results (${tracks.length})` : 'All Tracks'}
            </span>
            {searchQuery && (
              <Badge variant="secondary">{tracks.length} results</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tracks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onEdit={() => onEditTrack(track)}
                  onDelete={() => onDeleteTrack(track.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No tracks found' : 'No tracks available'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? 'Try adjusting your search terms.'
                  : 'Create your first track to get started.'
                }
              </p>
              {!searchQuery && (
                <Button onClick={onCreateTrack}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Track
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackGrid;
