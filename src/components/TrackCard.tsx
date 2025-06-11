
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Play, Calendar, Clock, Hash, ExternalLink } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  url: string;
  duration: number;
  artist_name?: string;
  album_name?: string;
  release_date?: string;
  track_number?: number;
  disc_number?: number;
  explicit?: boolean;
  cover_image_url?: string;
  hymnTitleNumber?: string;
  bookId?: number;
  created_at?: string;
  updated_at?: string;
}

interface TrackCardProps {
  track: Track;
  onEdit: () => void;
  onDelete: () => void;
}

const TrackCard = ({ track, onEdit, onDelete }: TrackCardProps) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Cover Image or Placeholder */}
        <div className="relative mb-3">
          {track.cover_image_url ? (
            <img
              src={track.cover_image_url}
              alt={`${track.title} cover`}
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center ${track.cover_image_url ? 'hidden' : ''}`}>
            <Play className="w-8 h-8 text-purple-500" />
          </div>
          
          {/* Explicit Badge */}
          {track.explicit && (
            <Badge variant="destructive" className="absolute top-2 left-2 text-xs">
              E
            </Badge>
          )}
        </div>

        {/* Track Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg truncate" title={track.title}>
            {track.title}
          </h3>
          
          {track.artist_name && (
            <p className="text-muted-foreground truncate" title={track.artist_name}>
              {track.artist_name}
            </p>
          )}
          
          {track.album_name && (
            <p className="text-sm text-muted-foreground truncate" title={track.album_name}>
              📀 {track.album_name}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(track.duration)}
            </div>
            
            {track.track_number && (
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {track.track_number}
                {track.disc_number && track.disc_number > 1 && (
                  <span>/{track.disc_number}</span>
                )}
              </div>
            )}
            
            {track.release_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(track.release_date)}
              </div>
            )}
          </div>

          {/* Hymn Info */}
          {track.hymnTitleNumber && (
            <Badge variant="outline" className="text-xs">
              Hymn #{track.hymnTitleNumber}
              {track.bookId && ` (Book ${track.bookId})`}
            </Badge>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 w-8 p-0"
                title="Edit track"
              >
                <Edit className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                title="Delete track"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(track.url, '_blank')}
                className="h-8 w-8 p-0"
                title="Open audio file"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
            
            <Button size="sm" variant="outline" className="h-8">
              <Play className="w-3 h-3 mr-1" />
              Play
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackCard;
