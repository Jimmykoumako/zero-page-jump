
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import type { SyncData } from '@/types/syncEditor';

interface SyncEditFormProps {
  syncPoint: SyncData;
  onUpdate: (syncPoint: SyncData) => void;
  onCancel: () => void;
}

const SyncEditForm = ({ syncPoint, onUpdate, onCancel }: SyncEditFormProps) => {
  const [editedSyncPoint, setEditedSyncPoint] = useState<SyncData>(syncPoint);

  return (
    <div className="space-y-3">
      <Textarea
        value={editedSyncPoint.text}
        onChange={(e) => setEditedSyncPoint(prev => ({ ...prev, text: e.target.value }))}
        className="min-h-[60px]"
        placeholder="Sync point text..."
      />
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium mb-1 block">Start Time</label>
          <Input
            type="number"
            step="0.1"
            value={editedSyncPoint.startTime}
            onChange={(e) => setEditedSyncPoint(prev => ({ ...prev, startTime: parseFloat(e.target.value) }))}
            className="h-8"
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">End Time</label>
          <Input
            type="number"
            step="0.1"
            value={editedSyncPoint.endTime}
            onChange={(e) => setEditedSyncPoint(prev => ({ ...prev, endTime: parseFloat(e.target.value) }))}
            className="h-8"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={() => onUpdate(editedSyncPoint)} size="sm" className="flex-1">
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel} size="sm">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SyncEditForm;
