
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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

interface HymnDisplayModeProps {
  hymn: Hymn;
  currentVerse: number;
  isLyricsOnly: boolean;
  displaySize: string;
}

const HymnDisplayMode = ({ hymn, currentVerse, isLyricsOnly, displaySize }: HymnDisplayModeProps) => {
  return (
    <div className={`${isLyricsOnly ? 'min-h-[80vh]' : 'min-h-[60vh]'} flex flex-col justify-center`}>
      <Carousel 
        className="w-full max-w-4xl mx-auto"
        opts={{
          align: "start",
          loop: false,
        }}
      >
        <CarouselContent>
          {hymn.verses.map((verse, index) => (
            <CarouselItem key={index}>
              <div className="text-center p-6">
                {!isLyricsOnly && (
                  <div className="text-2xl font-semibold text-blue-600 mb-8">
                    Verse {index + 1}
                  </div>
                )}
                <div className={`${isLyricsOnly ? 'text-5xl' : displaySize} leading-relaxed text-slate-800 max-w-3xl mx-auto`}>
                  {verse.split('\n').map((line, lineIdx) => (
                    <div key={lineIdx} className={`${isLyricsOnly ? 'mb-6' : 'mb-4'}`}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </CarouselItem>
          ))}
          {hymn.chorus && (
            <CarouselItem>
              <div className="text-center p-6">
                {!isLyricsOnly && (
                  <div className="text-2xl font-semibold text-yellow-700 mb-8">
                    Chorus
                  </div>
                )}
                <div className={`${isLyricsOnly ? 'text-5xl' : displaySize} leading-relaxed text-slate-800 max-w-3xl mx-auto`}>
                  {hymn.chorus.split('\n').map((line, lineIdx) => (
                    <div key={lineIdx} className={`${isLyricsOnly ? 'mb-6' : 'mb-4'}`}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
      
      {!isLyricsOnly && (
        <div className="text-center mt-8 text-slate-500">
          <p className="text-lg">Verse {currentVerse + 1} of {hymn.verses.length}</p>
          <p className="text-sm mt-2">Use arrow keys, spacebar, or swipe to navigate • Home/End for first/last verse</p>
        </div>
      )}
    </div>
  );
};

export default HymnDisplayMode;
