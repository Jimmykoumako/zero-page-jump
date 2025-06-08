
interface FullscreenContentProps {
  title: string;
  content: {
    type: 'verse' | 'chorus';
    number: number | null;
    content: string;
  };
  fontSizeClass: string;
  currentVerse: number;
  totalVerses: number;
  hasChorus: boolean;
  isPlayingAudio: boolean;
}

const FullscreenContent = ({ 
  title, 
  content, 
  fontSizeClass, 
  currentVerse, 
  totalVerses, 
  hasChorus,
  isPlayingAudio 
}: FullscreenContentProps) => {
  return (
    <>
      {/* Background gradient for visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Main content area */}
      <div className="relative h-full flex flex-col items-center justify-center p-8">
        {/* Hymn title - always visible but subtle */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-300 text-center opacity-70">
            {title}
          </h1>
        </div>

        {/* Current section indicator */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 mt-8">
          <div className="text-lg md:text-xl text-slate-400 text-center">
            {content.type === 'verse' ? `Verse ${content.number}` : 'Chorus'}
          </div>
        </div>

        {/* Audio status indicator */}
        {isPlayingAudio && (
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 mt-8">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <span className="text-sm text-slate-300">Playing Audio</span>
            </div>
          </div>
        )}

        {/* Main lyrics display */}
        <div className="flex-1 flex items-center justify-center max-w-6xl w-full">
          <div className="text-center">
            <div className={`${fontSizeClass} leading-relaxed text-white font-light`}>
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
              {content.type === 'verse' ? currentVerse + 1 : 'C'} of {totalVerses}{hasChorus ? ' + Chorus' : ''}
            </div>
            <div className="flex gap-1">
              {Array.from({ length: totalVerses + (hasChorus ? 1 : 0) }).map((_, idx) => (
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
    </>
  );
};

export default FullscreenContent;
