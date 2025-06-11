
import { useEffect } from "react";

interface FullscreenAutoScrollProps {
  isAutoScrollEnabled: boolean;
  autoScrollSpeed: number;
}

const FullscreenAutoScroll = ({
  isAutoScrollEnabled,
  autoScrollSpeed
}: FullscreenAutoScrollProps) => {
  useEffect(() => {
    if (!isAutoScrollEnabled) return;

    const scrollInterval = setInterval(() => {
      window.scrollBy({
        top: 1,
        behavior: 'smooth'
      });
    }, 100 - autoScrollSpeed);

    return () => clearInterval(scrollInterval);
  }, [isAutoScrollEnabled, autoScrollSpeed]);

  return null; // This component only handles auto-scroll logic
};

export default FullscreenAutoScroll;
