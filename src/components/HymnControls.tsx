
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Users, Crown } from "lucide-react";

interface HymnControlsProps {
  currentVerse: number;
  totalVerses: number;
  isPlaying: boolean;
  onPrevVerse: () => void;
  onNextVerse: () => void;
  onTogglePlay: () => void;
  isGroupLeader?: boolean;
}

const HymnControls = ({ 
  currentVerse, 
  totalVerses, 
  isPlaying, 
  onPrevVerse, 
  onNextVerse, 
  onTogglePlay,
  isGroupLeader 
}: HymnControlsProps) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-xl p-4 shadow-lg flex items-center gap-4 border">
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
        {isGroupLeader !== undefined && (
          <div className="flex items-center gap-1 text-xs text-slate-500 ml-2">
            {isGroupLeader ? (
              <>
                <Crown className="w-3 h-3 text-yellow-600" />
                <span>Leader</span>
              </>
            ) : (
              <>
                <Users className="w-3 h-3 text-blue-600" />
                <span>Following</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HymnControls;
