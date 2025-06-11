
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, Music } from "lucide-react";

interface FullscreenNavigationControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  totalHymns: number;
  onSearchClick: () => void;
  onBufferClick: () => void;
  bufferCount: number;
}

const FullscreenNavigationControls = ({
  onPrevious,
  onNext,
  currentIndex,
  totalHymns,
  onSearchClick,
  onBufferClick,
  bufferCount
}: FullscreenNavigationControlsProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={onPrevious}
        variant="outline"
        size="sm"
        className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
        disabled={currentIndex <= 0}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <span className="text-white text-sm">
        {currentIndex + 1} / {totalHymns}
      </span>
      
      <Button
        onClick={onNext}
        variant="outline"
        size="sm"
        className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
        disabled={currentIndex >= totalHymns - 1}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={onSearchClick}
        variant="outline"
        size="sm"
        className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
      >
        <Search className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={onBufferClick}
        variant="outline"
        size="sm"
        className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
      >
        <Music className="w-4 h-4 mr-1" />
        {bufferCount}
      </Button>
    </div>
  );
};

export default FullscreenNavigationControls;
