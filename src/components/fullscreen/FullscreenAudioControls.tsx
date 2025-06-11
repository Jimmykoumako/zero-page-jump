
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Square, Volume2, VolumeX, Music, SkipBack, SkipForward } from "lucide-react";
import { Hymn } from "@/types/hymn";

interface FullscreenAudioControlsProps {
  playingHymn: Hymn | null;
  currentAudio: HTMLAudioElement | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onTrackSelect: (hymn: Hymn) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const FullscreenAudioControls = ({ 
  playingHymn,
  currentAudio,
  isPlaying,
  currentTime,
  duration,
  volume,
  onPlayPause,
  onVolumeChange,
  onSeek,
  onTrackSelect,
  onPrevious,
  onNext
}: FullscreenAudioControlsProps) => {
  // Mock audio files for now
  const audioFiles: any[] = [];
  const loading = false;

  if (!playingHymn && audioFiles.length === 0 && !loading) {
    return null;
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black/80 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Track Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-12 h-12 bg-slate-700 rounded flex items-center justify-center">
            <Music className="w-6 h-6 text-slate-300" />
          </div>
          <div className="min-w-0">
            <h4 className="text-white font-medium truncate">
              {playingHymn ? `${playingHymn.number}. ${playingHymn.title}` : 'No track selected'}
            </h4>
            <p className="text-slate-400 text-sm truncate">
              {playingHymn?.author || 'Unknown Artist'}
            </p>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center gap-4">
          <Button
            onClick={onPrevious}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onPlayPause}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/10 w-12 h-12"
            disabled={!playingHymn}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </Button>
          
          <Button
            onClick={onNext}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        {playingHymn && (
          <div className="flex items-center gap-2 flex-1 min-w-0 ml-8">
            <span className="text-slate-400 text-xs">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 bg-slate-700 rounded-full h-1">
              <div 
                className="bg-white rounded-full h-1 transition-all duration-200"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="text-slate-400 text-xs">
              {formatTime(duration)}
            </span>
          </div>
        )}

        {/* Volume Control */}
        <div className="flex items-center gap-2 ml-4">
          <Button
            onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            {volume > 0 ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>
          <div className="w-20 bg-slate-700 rounded-full h-1">
            <div 
              className="bg-white rounded-full h-1 transition-all duration-200"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenAudioControls;
