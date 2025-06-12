
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import type { SyncPoint } from '@/types/syncEditor';

interface SyncEditFormProps {
  syncPoint: SyncPoint;
  onUpdate: (syncPoint: SyncPoint) => void;
  onCancel: () => void;
}

const SyncEditForm = ({ syncPoint, onUpdate, onCancel }: SyncEditFormProps) => {
  const [editedSyncPoint, setEditedSyncPoint] = useState<SyncPoint>(syncPoint);

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium mb-1 block">Sync Type</label>
        <Select 
          value={editedSyncPoint.type} 
          onValueChange={(value: any) => setEditedSyncPoint(prev => ({ ...prev, type: value }))}
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="verse">Verse</SelectItem>
            <SelectItem value="line">Line</SelectItem>
            <SelectItem value="group">Group</SelectItem>
            <SelectItem value="word">Word</SelectItem>
            <SelectItem value="syllable">Syllable</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Textarea
        value={editedSyncPoint.text}
        onChange={(e) => setEditedSyncPoint(prev => ({ ...prev, text: e.target.value }))}
        className="min-h-[60px]"
      />
      
      <div>
        <label className="text-xs font-medium mb-1 block">Timestamp</label>
        <Input
          type="number"
          step="0.1"
          value={editedSyncPoint.timestamp}
          onChange={(e) => setEditedSyncPoint(prev => ({ ...prev, timestamp: parseFloat(e.target.value) }))}
          className="h-8"
        />
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
