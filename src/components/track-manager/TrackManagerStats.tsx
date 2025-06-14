
import { Card, CardContent } from '@/components/ui/card';
import { Music, Hash, Calendar } from 'lucide-react';
import type { Track } from '@/types/track';

interface TrackManagerStatsProps {
  tracks: Track[];
}

const TrackManagerStats = ({ tracks }: TrackManagerStatsProps) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Music className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{tracks.length}</p>
                <p className="text-sm text-muted-foreground">Total Tracks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Hash className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {new Set(tracks.map(t => t.artist_name).filter(Boolean)).size}
                </p>
                <p className="text-sm text-muted-foreground">Artists</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {new Set(tracks.map(t => t.album_name).filter(Boolean)).size}
                </p>
                <p className="text-sm text-muted-foreground">Albums</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Music className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.floor(tracks.reduce((sum, track) => sum + track.duration, 0) / 60)}
                </p>
                <p className="text-sm text-muted-foreground">Total Minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackManagerStats;
