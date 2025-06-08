
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { hymns } from "@/data/hymns";
import HymnDisplay from "./HymnDisplay";
import QRCodeDisplay from "./QRCodeDisplay";

interface HymnBookProps {
  mode: 'hymnal' | 'display';
  deviceId: string;
  onBack: () => void;
}

const HymnBook = ({ mode, deviceId, onBack }: HymnBookProps) => {
  const [selectedHymn, setSelectedHymn] = useState<number | null>(null);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQR, setShowQR] = useState(mode === 'display');

  // Listen for remote control commands
  useEffect(() => {
    const handleRemoteCommand = (event: CustomEvent) => {
      const { command, data } = event.detail;
      
      switch (command) {
        case 'selectHymn':
          setSelectedHymn(data.hymnId);
          setCurrentVerse(0);
          break;
        case 'nextVerse':
          if (selectedHymn !== null) {
            const hymn = hymns.find(h => h.id === selectedHymn);
            if (hymn && currentVerse < hymn.verses.length - 1) {
              setCurrentVerse(prev => prev + 1);
            }
          }
          break;
        case 'prevVerse':
          if (currentVerse > 0) {
            setCurrentVerse(prev => prev - 1);
          }
          break;
        case 'togglePlay':
          setIsPlaying(prev => !prev);
          break;
      }
    };

    window.addEventListener(`remote-${deviceId}` as any, handleRemoteCommand);
    return () => window.removeEventListener(`remote-${deviceId}` as any, handleRemoteCommand);
  }, [deviceId, selectedHymn, currentVerse]);

  const handleHymnSelect = (hymnId: number) => {
    setSelectedHymn(hymnId);
    setCurrentVerse(0);
    setIsPlaying(false);
  };

  const nextVerse = () => {
    if (selectedHymn !== null) {
      const hymn = hymns.find(h => h.id === selectedHymn);
      if (hymn && currentVerse < hymn.verses.length - 1) {
        setCurrentVerse(prev => prev + 1);
      }
    }
  };

  const prevVerse = () => {
    if (currentVerse > 0) {
      setCurrentVerse(prev => prev - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  if (selectedHymn === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            {mode === 'display' && (
              <Button 
                onClick={() => setShowQR(!showQR)} 
                variant="outline"
              >
                {showQR ? 'Hide QR' : 'Show QR'}
              </Button>
            )}
          </div>

          {showQR && mode === 'display' && (
            <QRCodeDisplay deviceId={deviceId} />
          )}

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              {mode === 'display' ? 'Presentation Mode' : 'Hymn Selection'}
            </h1>
            <p className="text-slate-600">
              {mode === 'display' 
                ? 'Select a hymn to begin group singing' 
                : 'Choose a hymn to practice'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hymns.map((hymn) => (
              <Card 
                key={hymn.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => handleHymnSelect(hymn.id)}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">#{hymn.number}</div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{hymn.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{hymn.author}</p>
                  <div className="text-xs text-slate-500">
                    {hymn.verses.length} verses • {hymn.key} • {hymn.tempo} BPM
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const selectedHymnData = hymns.find(h => h.id === selectedHymn);
  if (!selectedHymnData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={() => setSelectedHymn(null)} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Hymns
          </Button>
          {mode === 'display' && (
            <Button 
              onClick={() => setShowQR(!showQR)} 
              variant="outline"
            >
              {showQR ? 'Hide QR' : 'Show QR'}
            </Button>
          )}
        </div>

        {showQR && mode === 'display' && (
          <QRCodeDisplay deviceId={deviceId} />
        )}

        <HymnDisplay 
          hymn={selectedHymnData}
          currentVerse={currentVerse}
          isPlaying={isPlaying}
          mode={mode}
        />

        {mode === 'hymnal' && (
          <div className="flex justify-center mt-8">
            <div className="bg-white rounded-xl p-4 shadow-lg flex items-center gap-4">
              <Button onClick={prevVerse} disabled={currentVerse === 0} size="sm">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button onClick={togglePlay} size="sm">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button 
                onClick={nextVerse} 
                disabled={currentVerse === selectedHymnData.verses.length - 1} 
                size="sm"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              <div className="text-sm text-slate-600 ml-4">
                Verse {currentVerse + 1} of {selectedHymnData.verses.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HymnBook;
