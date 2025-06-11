
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Music } from 'lucide-react';
import type { PlaylistCardProps } from '@/types/playlist';

const PlaylistCard = ({ title, description, trackCount, coverImage, onPlay }: PlaylistCardProps) => {
  return (
    <Card className="group cursor-pointer hover:bg-muted/50 transition-colors">
      <CardContent className="p-4">
        <div className="aspect-square bg-muted rounded-lg mb-4 relative overflow-hidden">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          <Button
            onClick={onPlay}
            size="sm"
            className="absolute bottom-2 right-2 w-10 h-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
        
        <div>
          <h3 className="font-semibold truncate mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground truncate mb-1">{description}</p>
          <p className="text-xs text-muted-foreground">
            {trackCount} {trackCount === 1 ? 'hymn' : 'hymns'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaylistCard;
