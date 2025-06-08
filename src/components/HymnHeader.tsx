
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import FullscreenButton from "./FullscreenButton";

interface HymnHeaderProps {
  onBack: () => void;
  mode: 'hymnal' | 'display';
  showQR: boolean;
  onToggleQR: () => void;
}

const HymnHeader = ({ onBack, mode, showQR, onToggleQR }: HymnHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Hymns
      </Button>
      <div className="flex gap-2">
        {mode === 'display' && (
          <Button 
            onClick={onToggleQR} 
            variant="outline"
          >
            {showQR ? 'Hide QR' : 'Show QR'}
          </Button>
        )}
        <FullscreenButton />
      </div>
    </div>
  );
};

export default HymnHeader;
