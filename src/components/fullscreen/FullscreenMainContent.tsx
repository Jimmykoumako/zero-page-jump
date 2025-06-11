
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface FullscreenMainContentProps {
  currentHymnData: any;
  showControls: boolean;
  onExitFullscreen: () => void;
  children: ReactNode;
}

const FullscreenMainContent = ({
  currentHymnData,
  showControls,
  onExitFullscreen,
  children
}: FullscreenMainContentProps) => {
  if (!currentHymnData) {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center z-50">
        <div className="text-center">
          <h2 className="text-2xl mb-4">No hymn selected</h2>
          <Button onClick={onExitFullscreen} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Exit Fullscreen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-white z-50 overflow-auto">
      <div className="min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default FullscreenMainContent;
