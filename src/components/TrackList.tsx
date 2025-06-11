
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, FileText } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  hymnNumber?: string;
  album?: string;
  duration?: string;
  hasLyrics?: boolean;
  lyrics?: any;
}

interface TrackListProps {
  tracks: Track[];
  currentTrack?: string;
  isPlaying: boolean;
  onPlayTrack: (trackId: string) => void;
  onShowLyrics?: (track: Track) => void;
}

const TrackList = ({ tracks, currentTrack, isPlaying, onPlayTrack, onShowLyrics }: TrackListProps) => {
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
                onClick={() => onPlayTrack(track.id)}
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
