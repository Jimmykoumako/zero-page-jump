import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Home, Square, ChevronUp, ChevronDown, Play, Pause, Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Hymn {
  id: string;
  number: string;
  title: string;
  author: string;
  verses: string[];
  chorus?: string;
  key: string;
  tempo: number;
}

interface AudioFile {
  id: string;
  url: string;
  audioTypeId: number;
  userId: string;
  createdAt: string;
  hymnTitleNumber?: string;
  bookId?: number;
}

interface FullscreenPresentationProps {
  hymn: Hymn;
  currentVerse: number;
  onVerseChange: (verse: number) => void;
  onExit: () => void;
}

const FullscreenPresentation = ({ hymn, currentVerse, onVerseChange, onExit }: FullscreenPresentationProps) => {
  const [showControls, setShowControls] = useState(true);
  const [isIdle, setIsIdle] = useState(false);
  const [fontSize, setFontSize] = useState(6);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioFile, setCurrentAudioFile] = useState<AudioFile | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Font size classes array for easy indexing
  const fontSizeClasses = [
    'text-xl',    // 0
    'text-2xl',   // 1
    'text-3xl',   // 2
    'text-4xl',   // 3
    'text-5xl',   // 4
    'text-6xl',   // 5
    'text-7xl',   // 6
    'text-8xl',   // 7
    'text-9xl'    // 8
  ];

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 1, fontSizeClasses.length - 1));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 1, 0));
  };

  // Fetch audio files for the current hymn
  useEffect(() => {
    const fetchAudioFiles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('AudioFile')
          .select('*')
          .eq('hymnTitleNumber', hymn.number)
          .order('createdAt', { ascending: false });

        if (error) throw error;
        setAudioFiles(data || []);
      } catch (error) {
        console.error('Error fetching audio files:', error);
        toast({
          title: "Error",
          description: "Failed to load audio files.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAudioFiles();
  }, [hymn.number, toast]);

  // Audio control functions
  const playAudio = (audioFile: AudioFile) => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
    }

    const audio = new Audio(audioFile.url);
    audio.addEventListener('loadstart', () => setLoading(true));
    audio.addEventListener('canplay', () => setLoading(false));
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentAudio(null);
      setCurrentAudioFile(null);
    });
    audio.addEventListener('error', () => {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load audio file.",
        variant: "destructive",
      });
    });

    setCurrentAudio(audio);
    setCurrentAudioFile(audioFile);
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(error => {
      console.error('Error playing audio:', error);
      toast({
        title: "Error",
        description: "Failed to play audio file.",
        variant: "destructive",
      });
    });
  };

  const togglePlayPause = () => {
    if (!currentAudio) return;

    if (isPlaying) {
      currentAudio.pause();
      setIsPlaying(false);
    } else {
      currentAudio.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Error playing audio:', error);
        toast({
          title: "Error",
          description: "Failed to play audio file.",
          variant: "destructive",
        });
      });
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
      setCurrentAudioFile(null);
    }
  };

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
    };
  }, [currentAudio]);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    const resetTimers = () => {
      setIsIdle(false);
      setShowControls(true);
      
      clearTimeout(idleTimer);
      clearTimeout(hideTimer);
      
      idleTimer = setTimeout(() => {
        setIsIdle(true);
      }, 2000);
      
      hideTimer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const handleActivity = () => {
      resetTimers();
    };

    resetTimers();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      clearTimeout(idleTimer);
      clearTimeout(hideTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          stopAudio();
          onExit();
          break;
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          if (currentVerse < hymn.verses.length - 1) {
            onVerseChange(currentVerse + 1);
          } else if (hymn.chorus && currentVerse === hymn.verses.length - 1) {
            onVerseChange(hymn.verses.length);
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (currentVerse > 0) {
            onVerseChange(currentVerse - 1);
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          increaseFontSize();
          break;
        case 'ArrowDown':
          event.preventDefault();
          decreaseFontSize();
          break;
        case 'Home':
          event.preventDefault();
          onVerseChange(0);
          break;
        case 'End':
          event.preventDefault();
          if (hymn.chorus) {
            onVerseChange(hymn.verses.length);
          } else {
            onVerseChange(hymn.verses.length - 1);
          }
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          if (currentAudio) {
            togglePlayPause();
          } else if (audioFiles.length > 0) {
            playAudio(audioFiles[0]);
          }
          break;
        case 's':
        case 'S':
          event.preventDefault();
          stopAudio();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVerse, hymn, onVerseChange, onExit, fontSize, currentAudio, audioFiles, togglePlayPause]);

  // Get current content based on current verse
  const getCurrentContent = () => {
    if (currentVerse < hymn.verses.length) {
      return {
        type: 'verse',
        number: currentVerse + 1,
        content: hymn.verses[currentVerse]
      };
    } else if (hymn.chorus) {
      return {
        type: 'chorus',
        number: null,
        content: hymn.chorus
      };
    }
    return null;
  };

  const canGoPrevious = currentVerse > 0;
  const canGoNext = currentVerse < hymn.verses.length - 1 || (hymn.chorus && currentVerse < hymn.verses.length);

  const content = getCurrentContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 text-white z-50 overflow-hidden">
      {/* Background gradient for visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Main content area */}
      <div className="relative h-full flex flex-col items-center justify-center p-8">
        {/* Hymn title - always visible but subtle */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-300 text-center opacity-70">
            {hymn.title}
          </h1>
        </div>

        {/* Current section indicator */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 mt-8">
          <div className="text-lg md:text-xl text-slate-400 text-center">
            {content.type === 'verse' ? `Verse ${content.number}` : 'Chorus'}
          </div>
        </div>

        {/* Audio status indicator */}
        {currentAudioFile && (
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 mt-8">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              {isPlaying ? (
                <Play className="w-4 h-4 text-green-400" />
              ) : (
                <Pause className="w-4 h-4 text-yellow-400" />
              )}
              <span className="text-sm text-slate-300">
                {isPlaying ? 'Playing' : 'Paused'} Audio
              </span>
            </div>
          </div>
        )}

        {/* Main lyrics display */}
        <div className="flex-1 flex items-center justify-center max-w-6xl w-full">
          <div className="text-center">
            <div className={`${fontSizeClasses[fontSize]} leading-relaxed text-white font-light`}>
              {content.content.split('\n').map((line, lineIdx) => (
                <div key={lineIdx} className="mb-4 md:mb-6 lg:mb-8">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="text-slate-400 text-center">
            <div className="text-sm mb-2">
              {content.type === 'verse' ? currentVerse + 1 : 'C'} of {hymn.verses.length}{hymn.chorus ? ' + Chorus' : ''}
            </div>
            <div className="flex gap-1">
              {Array.from({ length: hymn.verses.length + (hymn.chorus ? 1 : 0) }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentVerse ? 'bg-white' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating controls */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Exit button - top right */}
        <Button
          onClick={() => {
            stopAudio();
            onExit();
          }}
          variant="outline"
          size="sm"
          className="fixed top-6 right-6 pointer-events-auto bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
        >
          <X className="w-4 h-4 mr-2" />
          Exit Fullscreen
        </Button>

        {/* Font size controls - top left */}
        <div className="fixed top-6 left-6 pointer-events-auto flex flex-col gap-2">
          <Button
            onClick={increaseFontSize}
            variant="outline"
            size="sm"
            className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm w-10 h-10 p-0"
            disabled={fontSize >= fontSizeClasses.length - 1}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            onClick={decreaseFontSize}
            variant="outline"
            size="sm"
            className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm w-10 h-10 p-0"
            disabled={fontSize <= 0}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Audio controls - top center */}
        {audioFiles.length > 0 && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 pointer-events-auto">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 border border-white/20">
              {audioFiles.map((audioFile, index) => (
                <Button
                  key={audioFile.id}
                  onClick={() => playAudio(audioFile)}
                  variant="ghost"
                  size="sm"
                  className={`text-white hover:bg-white/20 ${
                    currentAudioFile?.id === audioFile.id ? 'bg-white/20' : ''
                  }`}
                  disabled={loading}
                >
                  <Volume2 className="w-4 h-4 mr-1" />
                  Audio {index + 1}
                </Button>
              ))}
              
              {currentAudio && (
                <Button
                  onClick={togglePlayPause}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              )}
              
              {currentAudio && (
                <Button
                  onClick={stopAudio}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <Square className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Navigation controls - center sides */}
        {canGoPrevious && (
          <Button
            onClick={() => onVerseChange(currentVerse - 1)}
            variant="outline"
            size="lg"
            className="fixed left-6 top-1/2 transform -translate-y-1/2 pointer-events-auto bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm w-12 h-12"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}

        {canGoNext && (
          <Button
            onClick={() => {
              if (currentVerse < hymn.verses.length - 1) {
                onVerseChange(currentVerse + 1);
              } else if (hymn.chorus) {
                onVerseChange(hymn.verses.length);
              }
            }}
            variant="outline"
            size="lg"
            className="fixed right-6 top-1/2 transform -translate-y-1/2 pointer-events-auto bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm w-12 h-12"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        )}

        {/* Quick navigation - bottom center */}
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <Button
              onClick={() => onVerseChange(0)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              disabled={currentVerse === 0}
            >
              <Home className="w-4 h-4" />
            </Button>
            
            <div className="text-white text-sm px-2 min-w-[80px] text-center">
              {content.type === 'verse' ? `Verse ${content.number}` : 'Chorus'}
            </div>
            
            <Button
              onClick={() => {
                if (hymn.chorus) {
                  onVerseChange(hymn.verses.length);
                } else {
                  onVerseChange(hymn.verses.length - 1);
                }
              }}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              disabled={!hymn.chorus && currentVerse === hymn.verses.length - 1}
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Help text - only shows when controls are visible */}
      {showControls && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-slate-400 text-sm text-center">
          <div>Arrow keys or spacebar to navigate • Up/Down arrows for font size • P to play/pause • S to stop • Home/End for first/last • Esc to exit</div>
        </div>
      )}
    </div>
  );
};

export default FullscreenPresentation;
