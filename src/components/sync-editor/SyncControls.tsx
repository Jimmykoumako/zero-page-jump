
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { formatTime } from '@/utils/mockAudio';

interface SyncControlsProps {
  currentTime: number;
  formatTime: (time: number) => string;
  onAddSyncPoint?: () => void;
}

const SyncControls = ({
  currentTime,
  formatTime,
  onAddSyncPoint = () => {}
}: SyncControlsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-lg font-mono">{formatTime(currentTime)}</p>
          <p className="text-sm text-muted-foreground">Current Time</p>
        </div>
        
        <Button 
          onClick={onAddSyncPoint}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Sync Point
        </Button>
      </CardContent>
    </Card>
  );
};

export default SyncControls;
