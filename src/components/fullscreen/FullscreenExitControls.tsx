
import { Button } from "@/components/ui/button";
import { X, Square } from "lucide-react";

interface FullscreenExitControlsProps {
  onExitFullscreen: () => void;
}

const FullscreenExitControls = ({ onExitFullscreen }: FullscreenExitControlsProps) => {
  return (
    <div className="fixed top-6 right-6 flex gap-2 z-50">
      <Button
        onClick={onExitFullscreen}
        variant="outline"
        size="sm"
        className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm w-10 h-10 p-0"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default FullscreenExitControls;
