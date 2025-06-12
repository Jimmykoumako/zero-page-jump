
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import type { LyricSyncData } from '@/types/syncEditor';

interface SyncEditFormProps {
  sync: LyricSyncData;
  onSave: (sync: LyricSyncData) => void;
  onCancel: () => void;
}

const SyncEditForm = ({ sync, onSave, onCancel }: SyncEditFormProps) => {
  const [editedSync, setEditedSync] = useState<LyricSyncData>(sync);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium mb-1 block">Sync Type</label>
          <Select 
            value={editedSync.sync_type} 
            onValueChange={(value: any) => setEditedSync(prev => ({ ...prev, sync_type: value }))}
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
        <div>
          <label className="text-xs font-medium mb-1 block">Verse Index</label>
          <Input
            type="number"
            value={editedSync.verse_index}
            onChange={(e) => setEditedSync(prev => ({ ...prev, verse_index: parseInt(e.target.value) }))}
            className="h-8"
          />
        </div>
      </div>
      
      <Textarea
        value={editedSync.text}
        onChange={(e) => setEditedSync(prev => ({ ...prev, text: e.target.value }))}
        className="min-h-[60px]"
      />
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium mb-1 block">Start Time</label>
          <Input
            type="number"
            step="0.1"
            value={editedSync.start_time}
            onChange={(e) => setEditedSync(prev => ({ ...prev, start_time: parseFloat(e.target.value) }))}
            className="h-8"
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">End Time</label>
          <Input
            type="number"
            step="0.1"
            value={editedSync.end_time}
            onChange={(e) => setEditedSync(prev => ({ ...prev, end_time: parseFloat(e.target.value) }))}
            className="h-8"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={() => onSave(editedSync)} size="sm" className="flex-1">
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
