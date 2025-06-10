
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Hymn } from "@/data/hymns";

interface HymnListProps {
  hymns: Hymn[];
  onHymnSelect: (hymnId: number) => void;
  selectedHymnbook?: any;
}

const HymnList = ({ hymns, onHymnSelect, selectedHymnbook }: HymnListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter hymns based on search term
  const filteredHymns = hymns.filter(hymn => 
    hymn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hymn.number.toString().includes(searchTerm) ||
    hymn.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort hymns numerically by their number
  const sortedHymns = [...filteredHymns].sort((a, b) => a.number - b.number);

  return (
    <Card className="p-6">
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search by hymn number, title, or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results count */}
      {searchTerm && (
        <div className="mb-4 text-sm text-slate-600">
          {sortedHymns.length} hymn{sortedHymns.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Hymn List */}
      {sortedHymns.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No hymns match your search criteria
        </div>
      ) : (
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
      )}
    </Card>
  );
};

export default HymnList;
