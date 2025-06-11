
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, FileText, Calendar, Clock } from 'lucide-react';
import { useListeningHistory } from '@/hooks/useListeningHistory';
import type { TrackListProps } from '@/types';
import type { Track } from '@/types/track';

interface UpdatedTrackListProps extends Omit<TrackListProps, 'tracks'> {
  tracks: Track[];
}

const TrackList = ({ tracks, currentTrack, isPlaying, onPlayTrack, onShowLyrics }: UpdatedTrackListProps) => {
  const { recordListeningSession } = useListeningHistory();

  const handlePlayTrack = async (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      // Record the listening session
      await recordListeningSession(
        track.id,
        track.title,
        {
          artistName: track.artist_name,
          albumName: track.album_name,
          hymnNumber: track.hymnTitleNumber,
          duration: track.duration
        }
      );
      
      // Call the original play function
      onPlayTrack(trackId);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
                {track.track_number || index + 1}
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

              {/* Cover Image */}
              <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                {track.cover_image_url ? (
                  <img
                    src={track.cover_image_url}
                    alt={`${track.title} cover`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-muted rounded flex items-center justify-center ${track.cover_image_url ? 'hidden' : ''}`}>
                  <Play className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate flex items-center gap-2">
                  {track.title}
                  {track.explicit && (
                    <Badge variant="destructive" className="text-xs px-1 py-0">
                      E
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {track.artist_name} • {track.album_name}
                </div>
                {track.release_date && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(track.release_date)}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {track.hymnTitleNumber && (
                  <Badge variant="outline" className="text-xs">
                    #{track.hymnTitleNumber}
                  </Badge>
                )}
                
                {(track.hymnTitleNumber) && onShowLyrics && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onShowLyrics({
                      id: track.id,
                      title: track.title,
                      artist: track.artist_name || '',
                      url: track.url,
                      hymnNumber: track.hymnTitleNumber,
                      album: track.album_name,
                      duration: formatDuration(track.duration),
                      hasLyrics: !!track.hymnTitleNumber
                    })}
                    className="h-8 w-8 p-0"
                    title="View lyrics"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                )}
                
                <div className="text-sm text-muted-foreground w-12 text-right flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(track.duration)}
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
