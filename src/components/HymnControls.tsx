
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface HymnControlsProps {
  currentVerse: number;
  totalVerses: number;
  isPlaying: boolean;
  onPrevVerse: () => void;
  onNextVerse: () => void;
  onTogglePlay: () => void;
}

const HymnControls = ({ 
  currentVerse, 
  totalVerses, 
  isPlaying, 
  onPrevVerse, 
  onNextVerse, 
  onTogglePlay 
}: HymnControlsProps) => {
  return (
    <div className="flex justify-center mt-8">
      <div className="bg-white rounded-xl p-4 shadow-lg flex items-center gap-4">
        <Button onClick={onPrevVerse} disabled={currentVerse === 0} size="sm">
          <SkipBack className="w-4 h-4" />
        </Button>
        <Button onClick={onTogglePlay} size="sm">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button 
          onClick={onNextVerse} 
          disabled={currentVerse === totalVerses - 1} 
          size="sm"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
        <div className="text-sm text-slate-600 ml-4">
          Verse {currentVerse + 1} of {totalVerses}
        </div>
      </div>
    </div>
  );
};

export default HymnControls;
