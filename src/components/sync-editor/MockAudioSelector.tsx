
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music } from 'lucide-react';
import { mockAudioFiles, formatTime } from '@/utils/mockAudio';

interface MockAudioSelectorProps {
  selectedMockAudio?: string;
  onLoadMockAudio?: (audioId: string) => void;
}

const MockAudioSelector = ({ selectedMockAudio = '', onLoadMockAudio = () => {} }: MockAudioSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5" />
          Mock Audio Files for Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockAudioFiles.map((audio) => (
            <Card 
              key={audio.id} 
              className={`cursor-pointer transition-colors ${
                selectedMockAudio === audio.id ? 'border-primary bg-primary/5' : 'hover:bg-accent/50'
              }`}
              onClick={() => onLoadMockAudio(audio.id)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">{audio.title}</h3>
                  <p className="text-xs text-muted-foreground">{audio.artist}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(audio.duration)}</p>
                  {selectedMockAudio === audio.id && (
                    <Badge variant="default" className="text-xs">Active</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MockAudioSelector;
