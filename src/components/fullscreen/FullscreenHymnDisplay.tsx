
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Hymn } from "@/types/hymn";

interface FullscreenHymnDisplayProps {
  hymn: Hymn;
  fontSize: number;
  showIntroCarousel: boolean;
  setShowIntroCarousel: (show: boolean) => void;
}

const FullscreenHymnDisplay = ({
  hymn,
  fontSize,
  showIntroCarousel,
  setShowIntroCarousel
}: FullscreenHymnDisplayProps) => {
  return (
    <div className="flex-1 pt-20 pb-32 px-8">
      {/* Hymn Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4" style={{ fontSize: `${fontSize + 12}px` }}>
          {hymn.number}. {hymn.title}
        </h1>
        {hymn.subtitle && (
          <h2 className="text-3xl text-gray-300 mb-2" style={{ fontSize: `${fontSize + 4}px` }}>
            {hymn.subtitle}
          </h2>
        )}
        {hymn.author && (
          <p className="text-xl text-gray-400" style={{ fontSize: `${fontSize}px` }}>
            by {hymn.author}
          </p>
        )}
      </div>

      {/* Intro Carousel */}
      {showIntroCarousel && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-40">
          <div className="text-center max-w-4xl px-8">
            <h1 className="text-8xl font-bold mb-6 text-white">
              {hymn.number}
            </h1>
            <h2 className="text-5xl font-bold mb-4 text-white">
              {hymn.title}
            </h2>
            {hymn.subtitle && (
              <h3 className="text-3xl text-gray-300 mb-6">
                {hymn.subtitle}
              </h3>
            )}
            {hymn.author && (
              <p className="text-2xl text-gray-400 mb-8">
                by {hymn.author}
              </p>
            )}
            <Button
              onClick={() => setShowIntroCarousel(false)}
              size="lg"
              className="bg-white text-black hover:bg-gray-200"
            >
              Begin Singing
            </Button>
          </div>
        </div>
      )}

      {/* Lyrics */}
      {!showIntroCarousel && (
        <div className="max-w-4xl mx-auto">
          {hymn.verses?.map((verse, index) => (
            <div key={index} className="mb-12">
              <div className="text-center leading-relaxed">
                {verse.split('\n').map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className="mb-2"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {hymn.chorus && (
            <div className="mb-12 border-l-4 border-blue-500 pl-8">
              <h3 className="text-2xl font-bold mb-4 text-blue-400">Chorus</h3>
              <div className="text-center leading-relaxed">
                {hymn.chorus.split('\n').map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className="mb-2"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FullscreenHymnDisplay;
