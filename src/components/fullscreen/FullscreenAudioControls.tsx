
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Square, Volume2, VolumeX, Music } from "lucide-react";

interface FullscreenAudioControlsProps {
  hymnNumber: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const FullscreenAudioControls = ({ 
  hymnNumber, 
  isVisible, 
  onToggleVisibility 
}: FullscreenAudioControlsProps) => {
  // Mock audio data for now
  const audioFiles: any[] = [];
  const isPlaying = false;
  const loading = false;

  if (audioFiles.length === 0 && !loading) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={onToggleVisibility}
        variant="outline"
        size="sm"
        className="fixed top-6 left-6 pointer-events-auto bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
      >
        <Music className="w-4 h-4 mr-2" />
        Audio ({audioFiles.length})
        {isPlaying && (
          <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse" />
        )}
      </Button>

      {/* Audio Controls Panel */}
      {isVisible && (
        <Card className="fixed top-20 left-6 w-80 max-h-96 pointer-events-auto bg-black/80 backdrop-blur-sm border-white/20 overflow-hidden">
          <div className="p-3 border-b border-white/20">
            <h3 className="text-white font-semibold">Audio Files</h3>
            <p className="text-slate-400 text-sm">
              {audioFiles.length} file{audioFiles.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {loading ? (
            <div className="p-4 text-center">
              <div className="text-white">Loading audio files...</div>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-64">
              {audioFiles.length === 0 && (
                <div className="p-4 text-center text-slate-400">
                  No audio files available for this hymn.
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </>
  );
};

export default FullscreenAudioControls;
