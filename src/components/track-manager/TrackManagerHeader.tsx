
import { Button } from '@/components/ui/button';
import { Music, Plus, ExternalLink } from 'lucide-react';

interface TrackManagerHeaderProps {
  onCreateTrack: () => void;
}

const TrackManagerHeader = ({ onCreateTrack }: TrackManagerHeaderProps) => {
  return (
    <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-3">
              <Music className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Track Manager</h1>
              <p className="text-muted-foreground">Manage your music library with Apple Music-style metadata</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.open('/audio-library', '_blank')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Audio Library
            </Button>
            <Button onClick={onCreateTrack} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Track
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackManagerHeader;
