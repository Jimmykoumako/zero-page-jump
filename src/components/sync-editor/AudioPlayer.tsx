
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
  selectedMockAudio: string;
  selectedMockAudioData: any;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  syncData: LyricSyncData[];
  currentLyric: LyricSyncData | undefined;
  onPlayPause: () => void;
  onSeek: (value: number[]) => void;
}

const AudioPlayer = ({
  audioRef,
  selectedMockAudio,
  selectedMockAudioData,
  isPlaying,
  currentTime,
  duration,
  syncData,
  currentLyric,
  onPlayPause,
  onSeek
}: AudioPlayerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{selectedMockAudioData?.title || 'No Audio Selected'}</span>
          <Badge variant="outline">
            {syncData.length} synced items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <audio
          ref={audioRef}
          src={selectedMockAudioData?.url}
          preload="metadata"
        />
        
        <div className="flex items-center gap-4">
          <Button
            onClick={onPlayPause}
            variant="outline"
            size="sm"
            disabled={!selectedMockAudio}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <div className="flex-1">
            <Slider
              value={duration ? [(currentTime / duration) * 100] : [0]}
              onValueChange={onSeek}
              max={100}
              step={0.1}
              className="w-full"
              disabled={!selectedMockAudio}
            />
          </div>
          
          <div className="text-sm text-muted-foreground min-w-[80px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Current Lyric Display */}
        {currentLyric && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Now Playing</span>
              <Badge variant="secondary" className="text-xs">{currentLyric.sync_type}</Badge>
            </div>
            <p className="text-lg font-medium">{currentLyric.text}</p>
            <p className="text-sm text-muted-foreground">
              {formatTime(currentLyric.start_time)} - {formatTime(currentLyric.end_time)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;
