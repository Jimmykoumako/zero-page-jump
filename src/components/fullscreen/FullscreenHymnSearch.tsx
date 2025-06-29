
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, X } from "lucide-react";
import { hymns } from "@/data/hymns";
import { Hymn } from "@/types/hymn";

interface FullscreenHymnSearchProps {
  selectedHymnbook: any;
  onSelectHymn: (hymn: Hymn) => void;
  onClose: () => void;
}

const FullscreenHymnSearch = ({ 
  selectedHymnbook,
  onSelectHymn,
  onClose
}: FullscreenHymnSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHymns, setFilteredHymns] = useState<Hymn[]>([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredHymns(hymns.slice(0, 20)); // Show first 20 hymns when no search
    } else {
      const filtered = hymns.filter(hymn =>
        hymn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hymn.number.toString().includes(searchTerm) ||
        hymn.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHymns(filtered.slice(0, 50)); // Limit to 50 results
    }
  }, [searchTerm]);

  const handleAddToBuffer = (hymn: Hymn) => {
    onSelectHymn(hymn);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Search Hymns</DialogTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by hymn number, title, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredHymns.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No hymns found matching your search
              </div>
            ) : (
              filteredHymns.map((hymn) => (
                <div
                  key={hymn.id}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-blue-400 font-bold w-12 text-sm">
                      #{hymn.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {hymn.title}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {hymn.author}
                      </p>
                      <p className="text-xs text-slate-500">
                        {hymn.verses.length} verses • {hymn.key} • {hymn.tempo} BPM
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddToBuffer(hymn)}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullscreenHymnSearch;
