
import { Music } from 'lucide-react';

const AudioBrowserLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <Music className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Loading Music Library</h3>
          <p className="text-muted-foreground">Discovering your hymns and worship music...</p>
        </div>
      </div>
    </div>
  );
};

export default AudioBrowserLoading;
