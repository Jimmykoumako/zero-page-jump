
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import FullscreenButton from "./FullscreenButton";

interface HymnPageHeaderProps {
  onBack: () => void;
  mode: 'hymnal' | 'display';
  showQR: boolean;
  onToggleQR: () => void;
  selectedHymnbook?: any;
}

const HymnPageHeader = ({ onBack, mode, showQR, onToggleQR, selectedHymnbook }: HymnPageHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
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

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          {selectedHymnbook ? selectedHymnbook.name : 
            (mode === 'display' ? 'Presentation Mode' : 'Hymn Selection')}
        </h1>
        <p className="text-slate-600">
          {selectedHymnbook ? selectedHymnbook.description :
            (mode === 'display' 
              ? 'Select a hymn to begin group singing' 
              : 'Choose a hymn to practice'
            )}
        </p>
      </div>
    </>
  );
};

export default HymnPageHeader;
