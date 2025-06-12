
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Edit, Trash2 } from 'lucide-react';
import { formatTime } from '@/utils/mockAudio';
import SyncEditForm from './SyncEditForm';
import type { LyricSyncData } from '@/types/syncEditor';

interface SyncDataListProps {
  syncData: LyricSyncData[];
  currentLyric: LyricSyncData | undefined;
  selectedSync: LyricSyncData | null;
  onSelectSync: (sync: LyricSyncData) => void;
  onUpdateSync: (sync: LyricSyncData) => void;
  onDeleteSync: (syncId: string) => void;
  onCancelEdit: () => void;
}

const SyncDataList = ({
  syncData,
  currentLyric,
  selectedSync,
  onSelectSync,
  onUpdateSync,
  onDeleteSync,
  onCancelEdit
}: SyncDataListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Synced Items ({syncData.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {syncData.length > 0 ? (
          <div className="space-y-2">
            {syncData.map((sync) => (
              <div
                key={sync.id}
                className={`border rounded-lg p-3 transition-colors ${
                  currentLyric?.id === sync.id ? 'bg-primary/10 border-primary' : 'hover:bg-accent/50'
                }`}
              >
                {selectedSync?.id === sync.id ? (
                  <SyncEditForm
                    sync={selectedSync}
                    onSave={onUpdateSync}
                    onCancel={onCancelEdit}
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {sync.sync_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          V{sync.verse_index} L{sync.line_index}
                        </span>
                      </div>
                      <p className="font-medium">{sync.text}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Start: {formatTime(sync.start_time)}</span>
                        <span>End: {formatTime(sync.end_time)}</span>
                        <span>Duration: {formatTime(sync.end_time - sync.start_time)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectSync(sync)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sync.id && onDeleteSync(sync.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No synced items yet</h3>
            <p className="text-muted-foreground">
              Load a mock audio file and start syncing lyrics at specific times.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SyncDataList;
