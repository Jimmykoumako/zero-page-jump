
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface FullscreenFontControlsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  isAutoScrollEnabled: boolean;
  setIsAutoScrollEnabled: (enabled: boolean) => void;
  autoScrollSpeed: number;
  setAutoScrollSpeed: (speed: number) => void;
}

const FullscreenFontControls = ({
  fontSize,
  setFontSize,
  isAutoScrollEnabled,
  setIsAutoScrollEnabled,
  autoScrollSpeed,
  setAutoScrollSpeed
}: FullscreenFontControlsProps) => {
  const maxFontSize = 32;
  const minFontSize = 12;

  return (
    <div className="fixed top-6 left-6 flex flex-col gap-2 z-50">
      <Button
        onClick={() => setFontSize(Math.min(fontSize + 2, maxFontSize))}
        variant="outline"
        size="sm"
        className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm w-10 h-10 p-0"
        disabled={fontSize >= maxFontSize}
      >
        <ChevronUp className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => setFontSize(Math.max(fontSize - 2, minFontSize))}
        variant="outline"
        size="sm"
        className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm w-10 h-10 p-0"
        disabled={fontSize <= minFontSize}
      >
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default FullscreenFontControls;
