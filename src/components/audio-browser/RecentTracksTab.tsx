
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import TrackList from '@/components/TrackList';
import EmptyStateCard from './EmptyStateCard';
import type { Track } from '@/types/track';

interface RecentTracksTabProps {
  recentTracks: Track[];
  currentTrack?: string;
  isPlaying: boolean;
  onPlayTrack: (trackId: string) => void;
}

const RecentTracksTab = ({
  recentTracks,
  currentTrack,
  isPlaying,
  onPlayTrack
}: RecentTracksTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recently Played</h2>
        <Button variant="outline" size="sm">Clear History</Button>
      </div>
      {recentTracks.length > 0 ? (
        <TrackList
          tracks={recentTracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayTrack={onPlayTrack}
        />
      ) : (
        <EmptyStateCard
          icon={Clock}
          title="No recent activity"
          description="Start listening to some tracks and they'll appear here."
          actionText="Browse Music"
          onAction={() => {
            const browseTab = document.querySelector('[value="browse"]') as HTMLElement;
            browseTab?.click();
          }}
        />
      )}
    </div>
  );
};

export default RecentTracksTab;
