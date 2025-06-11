
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, FileText } from 'lucide-react';
import { useListeningHistory } from '@/hooks/useListeningHistory';
import type { Track, TrackListProps } from '@/types';

const TrackList = ({ tracks, currentTrack, isPlaying, onPlayTrack, onShowLyrics }: TrackListProps) => {
  const { recordListeningSession } = useListeningHistory();

  const handlePlayTrack = async (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      // Record the listening session
      await recordListeningSession(
        track.id,
        track.title,
        {
          artistName: track.artist,
          albumName: track.album,
          hymnNumber: track.hymnNumber,
          duration: track.duration ? parseInt(track.duration.split(':')[0]) * 60 + parseInt(track.duration.split(':')[1]) : undefined
        }
      );
      
      // Call the original play function
      onPlayTrack(trackId);
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="space-y-1">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                currentTrack === track.id ? 'bg-muted' : ''
              }`}
            >
              <div className="text-sm text-muted-foreground w-8">
                {index + 1}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => handlePlayTrack(track.id)}
              >
                {currentTrack === track.id && isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{track.title}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {track.artist} • {track.album}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {track.hymnNumber && (
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    #{track.hymnNumber}
                  </span>
                )}
                
                {(track.hasLyrics || track.hymnNumber) && onShowLyrics && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onShowLyrics(track)}
                    className="h-8 w-8 p-0"
                    title="View lyrics"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                )}
                
                <div className="text-sm text-muted-foreground w-12 text-right">
                  {track.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackList;
