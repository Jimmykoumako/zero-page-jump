
import { useState, useEffect, ReactNode } from "react";

interface FullscreenControlsManagerProps {
  children: (showControls: boolean) => ReactNode;
}

const FullscreenControlsManager = ({ children }: FullscreenControlsManagerProps) => {
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetTimeout = () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      setShowControls(true);
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      setControlsTimeout(timeout);
    };

    const handleMouseMove = () => resetTimeout();
    const handleKeyPress = () => resetTimeout();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleMouseMove);

    resetTimeout();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleMouseMove);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  return <>{children(showControls)}</>;
};

export default FullscreenControlsManager;
