
import { useState } from "react";
import { Hymn } from "@/data/hymns";

export const useHymnBuffer = () => {
  const [hymnBuffer, setHymnBuffer] = useState<Hymn[]>([]);
  const [currentBufferIndex, setCurrentBufferIndex] = useState(0);

  const addToBuffer = (hymn: Hymn) => {
    setHymnBuffer(prev => {
      // Check if hymn is already in buffer
      if (prev.some(h => h.id === hymn.id)) {
        return prev;
      }
      return [...prev, hymn];
    });
  };

  const removeFromBuffer = (hymnId: number) => {
    setHymnBuffer(prev => {
      const newBuffer = prev.filter(h => h.id !== hymnId);
      // Adjust current index if needed
      if (currentBufferIndex >= newBuffer.length && newBuffer.length > 0) {
        setCurrentBufferIndex(newBuffer.length - 1);
      } else if (newBuffer.length === 0) {
        setCurrentBufferIndex(0);
      }
      return newBuffer;
    });
  };

  const clearBuffer = () => {
    setHymnBuffer([]);
    setCurrentBufferIndex(0);
  };

  const moveToNext = () => {
    if (currentBufferIndex < hymnBuffer.length - 1) {
      setCurrentBufferIndex(prev => prev + 1);
      return hymnBuffer[currentBufferIndex + 1];
    }
    return null;
  };

  const moveToPrevious = () => {
    if (currentBufferIndex > 0) {
      setCurrentBufferIndex(prev => prev - 1);
      return hymnBuffer[currentBufferIndex - 1];
    }
    return null;
  };

  const setCurrentHymn = (hymnId: number) => {
    const index = hymnBuffer.findIndex(h => h.id === hymnId);
    if (index !== -1) {
      setCurrentBufferIndex(index);
      return hymnBuffer[index];
    }
    return null;
  };

  return {
    hymnBuffer,
    buffer: hymnBuffer, // Add alias for backward compatibility
    currentBufferIndex,
    currentHymn: hymnBuffer[currentBufferIndex] || null,
    addToBuffer,
    removeFromBuffer,
    clearBuffer, // Add clearBuffer method
    moveToNext,
    moveToPrevious,
    setCurrentHymn,
    hasNext: currentBufferIndex < hymnBuffer.length - 1,
    hasPrevious: currentBufferIndex > 0
  };
};
