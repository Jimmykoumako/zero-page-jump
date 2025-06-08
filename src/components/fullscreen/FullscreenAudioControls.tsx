
import { Button } from "@/components/ui/button";
import { Volume2, Play, Pause, Square } from "lucide-react";

interface AudioFile {
  id: string;
  url: string;
  audioTypeId: number;
  userId: string;
  createdAt: string;
  hymnTitleNumber?: string;
  bookId?: number;
}

interface FullscreenAudioControlsProps {
  audioFiles: AudioFile[];
  currentAudioFile: AudioFile | null;
  currentAudio: HTMLAudioElement | null;
  isPlaying: boolean;
  loading: boolean;
  onPlayAudio: (audioFile: AudioFile) => void;
  onTogglePlayPause: () => void;
  onStopAudio: () => void;
}

const FullscreenAudioControls = ({
  audioFiles,
  currentAudioFile,
  currentAudio,
  isPlaying,
  loading,
  onPlayAudio,
  onTogglePlayPause,
  onStopAudio
}: FullscreenAudioControlsProps) => {
  if (audioFiles.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 pointer-events-auto">
      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 border border-white/20">
        {audioFiles.map((audioFile, index) => (
          <Button
            key={audioFile.id}
            onClick={() => onPlayAudio(audioFile)}
            variant="ghost"
            size="sm"
            className={`text-white hover:bg-white/20 ${
              currentAudioFile?.id === audioFile.id ? 'bg-white/20' : ''
            }`}
            disabled={loading}
          >
            <Volume2 className="w-4 h-4 mr-1" />
            Audio {index + 1}
          </Button>
        ))}
        
        {currentAudio && (
          <Button
            onClick={onTogglePlayPause}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        )}
        
        {currentAudio && (
          <Button
            onClick={onStopAudio}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <Square className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FullscreenAudioControls;
