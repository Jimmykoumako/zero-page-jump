
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Hymn } from "@/types/hymn";

interface FullscreenHymnBufferProps {
  buffer: Hymn[];
  onSelectHymn: (hymn: Hymn) => void;
  onRemoveFromBuffer: (hymnId: number) => void;
  onClearBuffer: () => void;
  onClose: () => void;
}

const FullscreenHymnBuffer = ({
  buffer,
  onSelectHymn,
  onRemoveFromBuffer,
  onClearBuffer,
  onClose
}: FullscreenHymnBufferProps) => {
  if (buffer.length === 0) {
    return (
      <div className="fixed top-20 right-6 w-80 pointer-events-auto bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
        <div className="p-3 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Hymn Buffer</h3>
              <p className="text-slate-400 text-sm">No hymns in buffer</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white w-6 h-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="p-4 text-center text-slate-400">
          Add hymns to your buffer to queue them for presentation.
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-6 w-80 max-h-96 pointer-events-auto bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
      <div className="p-3 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">Hymn Buffer</h3>
            <p className="text-slate-400 text-sm">{buffer.length} hymns ready</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white w-6 h-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-80">
        {buffer.map((hymn, index) => (
          <div
            key={hymn.id}
            className="flex items-center justify-between p-3 border-b border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
            onClick={() => onSelectHymn(hymn)}
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="text-slate-400 text-xs font-bold w-8">
                #{hymn.number}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-slate-300 font-medium text-sm truncate">
                  {hymn.title}
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  {hymn.author}
                </p>
              </div>
            </div>
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromBuffer(hymn.id);
              }}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-red-400 hover:bg-red-400/20 w-6 h-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
      
      {buffer.length > 0 && (
        <div className="p-3 border-t border-white/20">
          <Button
            onClick={onClearBuffer}
            variant="outline"
            size="sm"
            className="w-full bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30"
          >
            Clear Buffer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FullscreenHymnBuffer;
