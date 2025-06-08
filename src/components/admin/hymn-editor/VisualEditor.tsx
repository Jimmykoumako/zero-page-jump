
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical, Copy, ArrowUp, ArrowDown } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface LyricsLine {
  text: string;
  syllables: string[];
}

interface LyricsData {
  order: string[];
  verses: LyricsLine[][];
  choruses: LyricsLine[][];
}

interface VisualEditorProps {
  lyricsData: LyricsData;
  hymnNumber: string;
  onLyricsChange: (data: LyricsData) => void;
  onHymnNumberChange: (number: string) => void;
}

const VisualEditor = ({ lyricsData, hymnNumber, onLyricsChange, onHymnNumberChange }: VisualEditorProps) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const addVerse = () => {
    const newVerseIndex = lyricsData.verses.length;
    const newVerses = [...lyricsData.verses, [{ text: "", syllables: [] }]];
    const newOrder = [...lyricsData.order, `verse${newVerseIndex + 1}`];
    
    onLyricsChange({
      ...lyricsData,
      verses: newVerses,
      order: newOrder
    });
  };

  const addChorus = () => {
    const newChorusIndex = lyricsData.choruses.length;
    const newChoruses = [...lyricsData.choruses, [{ text: "", syllables: [] }]];
    const newOrder = [...lyricsData.order, `chorus${newChorusIndex + 1}`];
    
    onLyricsChange({
      ...lyricsData,
      choruses: newChoruses,
      order: newOrder
    });
  };

  const addLine = (sectionType: 'verse' | 'chorus', sectionIndex: number) => {
    if (sectionType === 'verse') {
      const newVerses = [...lyricsData.verses];
      newVerses[sectionIndex] = [...newVerses[sectionIndex], { text: "", syllables: [] }];
      onLyricsChange({ ...lyricsData, verses: newVerses });
    } else {
      const newChoruses = [...lyricsData.choruses];
      newChoruses[sectionIndex] = [...newChoruses[sectionIndex], { text: "", syllables: [] }];
      onLyricsChange({ ...lyricsData, choruses: newChoruses });
    }
  };

  const updateLine = (sectionType: 'verse' | 'chorus', sectionIndex: number, lineIndex: number, text: string) => {
    const syllables = text.split(/[-\s]+/).filter(s => s.length > 0);
    
    if (sectionType === 'verse') {
      const newVerses = [...lyricsData.verses];
      newVerses[sectionIndex][lineIndex] = { text, syllables };
      onLyricsChange({ ...lyricsData, verses: newVerses });
    } else {
      const newChoruses = [...lyricsData.choruses];
      newChoruses[sectionIndex][lineIndex] = { text, syllables };
      onLyricsChange({ ...lyricsData, choruses: newChoruses });
    }
  };

  const deleteLine = (sectionType: 'verse' | 'chorus', sectionIndex: number, lineIndex: number) => {
    if (sectionType === 'verse') {
      const newVerses = [...lyricsData.verses];
      newVerses[sectionIndex].splice(lineIndex, 1);
      onLyricsChange({ ...lyricsData, verses: newVerses });
    } else {
      const newChoruses = [...lyricsData.choruses];
      newChoruses[sectionIndex].splice(lineIndex, 1);
      onLyricsChange({ ...lyricsData, choruses: newChoruses });
    }
  };

  const deleteSection = (sectionId: string) => {
    const newOrder = lyricsData.order.filter(id => id !== sectionId);
    
    if (sectionId.startsWith('verse')) {
      const verseIndex = parseInt(sectionId.replace('verse', '')) - 1;
      const newVerses = lyricsData.verses.filter((_, index) => index !== verseIndex);
      onLyricsChange({ ...lyricsData, verses: newVerses, order: newOrder });
    } else if (sectionId.startsWith('chorus')) {
      const chorusIndex = parseInt(sectionId.replace('chorus', '')) - 1;
      const newChoruses = lyricsData.choruses.filter((_, index) => index !== chorusIndex);
      onLyricsChange({ ...lyricsData, choruses: newChoruses, order: newOrder });
    }
  };

  const duplicateSection = (sectionId: string) => {
    if (sectionId.startsWith('verse')) {
      const verseIndex = parseInt(sectionId.replace('verse', '')) - 1;
      const sectionToDuplicate = lyricsData.verses[verseIndex];
      const newVerses = [...lyricsData.verses, [...sectionToDuplicate]];
      const newOrder = [...lyricsData.order, `verse${newVerses.length}`];
      onLyricsChange({ ...lyricsData, verses: newVerses, order: newOrder });
    } else if (sectionId.startsWith('chorus')) {
      const chorusIndex = parseInt(sectionId.replace('chorus', '')) - 1;
      const sectionToDuplicate = lyricsData.choruses[chorusIndex];
      const newChoruses = [...lyricsData.choruses, [...sectionToDuplicate]];
      const newOrder = [...lyricsData.order, `chorus${newChoruses.length}`];
      onLyricsChange({ ...lyricsData, choruses: newChoruses, order: newOrder });
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newOrder = Array.from(lyricsData.order);
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);

    onLyricsChange({ ...lyricsData, order: newOrder });
  };

  const renderSection = (sectionId: string, index: number) => {
    let sectionData: LyricsLine[] = [];
    let sectionType: 'verse' | 'chorus' = 'verse';
    let sectionIndex = 0;
    let sectionTitle = '';

    if (sectionId.startsWith('verse')) {
      sectionIndex = parseInt(sectionId.replace('verse', '')) - 1;
      sectionData = lyricsData.verses[sectionIndex] || [];
      sectionType = 'verse';
      sectionTitle = `Verse ${sectionIndex + 1}`;
    } else if (sectionId.startsWith('chorus')) {
      sectionIndex = parseInt(sectionId.replace('chorus', '')) - 1;
      sectionData = lyricsData.choruses[sectionIndex] || [];
      sectionType = 'chorus';
      sectionTitle = `Chorus ${sectionIndex + 1}`;
    }

    return (
      <Draggable key={sectionId} draggableId={sectionId} index={index}>
        {(provided) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`mb-4 ${selectedSection === sectionId ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedSection(sectionId)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div {...provided.dragHandleProps}>
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                  </div>
                  {sectionTitle}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateSection(sectionId);
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSection(sectionId);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sectionData.map((line, lineIndex) => (
                  <div key={lineIndex} className="flex items-center gap-2">
                    <Textarea
                      value={line.text}
                      onChange={(e) => updateLine(sectionType, sectionIndex, lineIndex, e.target.value)}
                      placeholder="Enter lyrics line..."
                      className="min-h-[40px] resize-none"
                      rows={1}
                    />
                    <Button
                      onClick={() => deleteLine(sectionType, sectionIndex, lineIndex)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => addLine(sectionType, sectionIndex)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Line
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </Draggable>
    );
  };

  return (
    <div className="space-y-6">
      {/* Hymn Number Input */}
      <div>
        <Label htmlFor="hymn-number">Hymn Number</Label>
        <Input
          id="hymn-number"
          value={hymnNumber}
          onChange={(e) => onHymnNumberChange(e.target.value)}
          placeholder="e.g., 001, 123"
          className="w-48"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button onClick={addVerse} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Verse
        </Button>
        <Button onClick={addChorus} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Chorus
        </Button>
      </div>

      {/* Sections */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="lyrics-sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {lyricsData.order.map((sectionId, index) => 
                renderSection(sectionId, index)
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {lyricsData.order.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No sections added yet</p>
          <div className="flex justify-center gap-2">
            <Button onClick={addVerse} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add First Verse
            </Button>
            <Button onClick={addChorus} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add First Chorus
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualEditor;
