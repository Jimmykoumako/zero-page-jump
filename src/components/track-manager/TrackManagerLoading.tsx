
import { Music } from 'lucide-react';

const TrackManagerLoading = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
        <p className="text-muted-foreground">Loading tracks...</p>
      </div>
    </div>
  );
};

export default TrackManagerLoading;
