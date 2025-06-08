
import { Card } from "@/components/ui/card";

interface Hymn {
  id: string;
  number: string;
  title: string;
  author: string;
  verses: string[];
  chorus?: string;
  key: string;
  tempo: number;
}

interface HymnListProps {
  hymns: Hymn[];
  onHymnSelect: (hymnId: string) => void;
  selectedHymnbook?: any;
}

const HymnList = ({ hymns, onHymnSelect, selectedHymnbook }: HymnListProps) => {
  if (hymns.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-xl font-semibold text-slate-600 mb-2">No Hymns Available</h3>
        <p className="text-slate-500">
          {selectedHymnbook 
            ? `No hymns found in ${selectedHymnbook.name}` 
            : 'No hymns available in this collection'
          }
        </p>
      </Card>
    );
  }

  // Sort hymns numerically by their number
  const sortedHymns = [...hymns].sort((a, b) => {
    const numA = parseInt(a.number, 10);
    const numB = parseInt(b.number, 10);
    return numA - numB;
  });

  return (
    <Card className="p-6">
      <div className="space-y-2">
        {sortedHymns.map((hymn) => (
          <div 
            key={hymn.id}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors"
            onClick={() => onHymnSelect(hymn.id)}
          >
            <div className="flex items-center gap-4">
              <div className="text-lg font-bold text-blue-600 w-12">#{hymn.number}</div>
              <div>
                <h3 className="font-semibold text-slate-800">{hymn.title}</h3>
                <p className="text-sm text-slate-600">{hymn.author}</p>
              </div>
            </div>
            <div className="text-xs text-slate-500 text-right">
              <div>{hymn.verses.length} verses</div>
              <div>{hymn.key} • {hymn.tempo} BPM</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default HymnList;
