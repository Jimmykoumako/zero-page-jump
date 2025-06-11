
import { Card, CardContent } from '@/components/ui/card';
import { Music, Users, Heart } from 'lucide-react';

interface AudioBrowserStatsProps {
  trackCount: number;
  playlistCount: number;
  favoriteCount?: number;
}

const AudioBrowserStats = ({ trackCount, playlistCount, favoriteCount = 0 }: AudioBrowserStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-600">{trackCount}</p>
              <p className="text-sm font-medium text-muted-foreground">Total Tracks</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Music className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent"></div>
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-green-600">{playlistCount}</p>
              <p className="text-sm font-medium text-muted-foreground">Playlists</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent"></div>
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-purple-600">{favoriteCount}</p>
              <p className="text-sm font-medium text-muted-foreground">Favorites</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioBrowserStats;
