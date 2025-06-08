
import { Card } from "@/components/ui/card";

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

interface HymnDisplayProps {
  hymn: Hymn;
  currentVerse: number;
  isPlaying: boolean;
  mode: 'hymnal' | 'display';
}

const HymnDisplay = ({ hymn, currentVerse, isPlaying, mode }: HymnDisplayProps) => {
  const displaySize = mode === 'display' ? 'text-4xl' : 'text-2xl';
  const titleSize = mode === 'display' ? 'text-6xl' : 'text-3xl';
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 bg-white shadow-xl">
        <div className="text-center mb-8">
          <div className="text-blue-600 font-bold text-xl mb-2">#{hymn.number}</div>
          <h1 className={`${titleSize} font-bold text-slate-800 mb-4`}>{hymn.title}</h1>
          <p className="text-slate-600">by {hymn.author}</p>
          <div className="text-sm text-slate-500 mt-2">
            Key: {hymn.key} • Tempo: {hymn.tempo} BPM
          </div>
        </div>

        <div className="space-y-8">
          {mode === 'display' ? (
            // Display mode shows only current verse large
            <div className="text-center">
              <div className="text-2xl font-semibold text-blue-600 mb-4">
                Verse {currentVerse + 1}
              </div>
              <div className={`${displaySize} leading-relaxed text-slate-800`}>
                {hymn.verses[currentVerse]?.split('\n').map((line, idx) => (
                  <div key={idx} className="mb-2">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Hymnal mode shows all verses with current highlighted
            hymn.verses.map((verse, index) => (
              <div 
                key={index}
                className={`p-6 rounded-lg transition-all duration-300 ${
                  index === currentVerse 
                    ? 'bg-blue-50 border-2 border-blue-200 shadow-md' 
                    : 'bg-gray-50 opacity-70'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`font-bold text-lg ${
                    index === currentVerse ? 'text-blue-600' : 'text-slate-400'
                  }`}>
                    {index + 1}.
                  </div>
                  <div className={`${displaySize} leading-relaxed ${
                    index === currentVerse ? 'text-slate-800' : 'text-slate-500'
                  }`}>
                    {verse.split('\n').map((line, lineIdx) => (
                      <div key={lineIdx} className="mb-1">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}

          {hymn.chorus && (
            <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-700 mb-4">Chorus</div>
                <div className={`${displaySize} leading-relaxed text-slate-800`}>
                  {hymn.chorus.split('\n').map((line, idx) => (
                    <div key={idx} className="mb-1">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {isPlaying && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Playing
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HymnDisplay;
