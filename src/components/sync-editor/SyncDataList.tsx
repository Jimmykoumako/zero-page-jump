
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Edit, Trash2 } from 'lucide-react';
import type { SyncData } from '@/types/syncEditor';

interface SyncDataListProps {
  syncData: SyncData[];
  selectedSyncIndex?: number | null;
  onSelect: (index: number | null) => void;
  onUpdate: (index: number, updates: Partial<SyncData>) => void;
  onDelete: (index: number) => void;
  formatTime: (time: number) => string;
}

const SyncDataList = ({
  syncData,
  selectedSyncIndex,
  onSelect,
  onUpdate,
  onDelete,
  formatTime
}: SyncDataListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync Points ({syncData.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {syncData.length > 0 ? (
          <div className="space-y-2">
            {syncData.map((syncPoint, index) => (
              <div
                key={syncPoint.id}
                className={`border rounded-lg p-3 transition-colors hover:bg-accent/50 cursor-pointer ${
                  selectedSyncIndex === index ? 'bg-accent' : ''
                }`}
                onClick={() => onSelect(selectedSyncIndex === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        Sync Point
                      </Badge>
                    </div>
                    <p className="font-medium">{syncPoint.text}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Start: {formatTime(syncPoint.startTime)}</span>
                      <span>End: {formatTime(syncPoint.endTime)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(index);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(index);
                      }}
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
            <h3 className="font-semibold mb-2">No sync points yet</h3>
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
