
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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedHymns.map((hymn) => (
        <Card 
          key={hymn.id}
          className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
          onClick={() => onHymnSelect(hymn.id)}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">#{hymn.number}</div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{hymn.title}</h3>
            <p className="text-sm text-slate-600 mb-4">{hymn.author}</p>
            <div className="text-xs text-slate-500">
              {hymn.verses.length} verses • {hymn.key} • {hymn.tempo} BPM
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HymnList;
