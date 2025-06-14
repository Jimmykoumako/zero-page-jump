
import { RefObject } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  audioRef: RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onPlayPause: (playing: boolean) => void;
}

const AudioPlayer = ({
  audioUrl,
  audioRef,
  isPlaying,
  currentTime,
  duration,
  onTimeUpdate,
  onDurationChange,
  onPlayPause
}: AudioPlayerProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && duration > 0) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      onTimeUpdate(newTime);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      onPlayPause(!isPlaying);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Audio Player</span>
          <Badge variant="outline">
            Player Controls
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
          onDurationChange={(e) => onDurationChange(e.currentTarget.duration)}
        />
        
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePlayPause}
            variant="outline"
            size="sm"
            disabled={!audioUrl}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <div className="flex-1">
            <Slider
              value={duration ? [(currentTime / duration) * 100] : [0]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
              disabled={!audioUrl || duration === 0}
            />
          </div>
          
          <div className="text-sm text-muted-foreground min-w-[80px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;
