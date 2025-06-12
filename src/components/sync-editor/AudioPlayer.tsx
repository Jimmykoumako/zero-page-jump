
import { RefObject } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Clock } from 'lucide-react';
import { formatTime } from '@/utils/mockAudio';
import type { LyricSyncData } from '@/types/syncEditor';

interface AudioPlayerProps {
  audioRef: RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  onPlay: () => void;
  onStop: () => void;
  onSeek: (value: number[]) => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackRateChange: (rate: number) => void;
}

const AudioPlayer = ({
  audioRef,
  isPlaying,
  currentTime,
  duration,
  volume,
  playbackRate,
  onPlay,
  onStop,
  onSeek,
  onVolumeChange,
  onPlaybackRateChange
}: AudioPlayerProps) => {
  const handleSeek = (value: number[]) => {
    onSeek(value);
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
          preload="metadata"
        />
        
        <div className="flex items-center gap-4">
          <Button
            onClick={onPlay}
            variant="outline"
            size="sm"
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
