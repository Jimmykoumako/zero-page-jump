
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Edit, Trash2 } from 'lucide-react';
import { formatTime } from '@/utils/mockAudio';
import SyncEditForm from './SyncEditForm';
import type { LyricSyncData, SyncData, SyncPoint } from '@/types/syncEditor';

interface SyncDataListProps {
  syncData: SyncData[];
  selectedSyncPoint?: SyncPoint | null;
  onEditSyncPoint: (syncPoint: SyncPoint) => void;
  onDeleteSyncPoint: (syncPointId: string) => void;
  onJumpToSyncPoint: (timestamp: number) => void;
  formatTime: (time: number) => string;
}

const SyncDataList = ({
  syncData,
  selectedSyncPoint,
  onEditSyncPoint,
  onDeleteSyncPoint,
  onJumpToSyncPoint,
  formatTime
}: SyncDataListProps) => {
  const allSyncPoints = syncData.flatMap(data => data.syncPoints);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Synced Items ({allSyncPoints.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {allSyncPoints.length > 0 ? (
          <div className="space-y-2">
            {allSyncPoints.map((syncPoint) => (
              <div
                key={syncPoint.id}
                className="border rounded-lg p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {syncPoint.type}
                      </Badge>
                    </div>
                    <p className="font-medium">{syncPoint.text}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Time: {formatTime(syncPoint.timestamp)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditSyncPoint(syncPoint)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteSyncPoint(syncPoint.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No synced items yet</h3>
            <p className="text-muted-foreground">
              Start adding sync points to synchronize content with audio.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SyncDataList;
