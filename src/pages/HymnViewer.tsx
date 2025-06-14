import FullscreenHymnDisplay from "@/components/fullscreen/FullscreenHymnDisplay";
import { useState } from "react";

// Dummy hymn data for demo; replace with real hymn selection logic as needed
const demoHymn = {
  number: 1,
  title: "Amazing Grace",
  subtitle: "",
  verses: [
    "Amazing grace! how sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found,\nWas blind, but now I see.",
    "'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed!"
  ],
  chorus: "",
};

const HymnViewerPage = () => {
  // You can replace this with real state/logic as needed
  const [fontSize, setFontSize] = useState(24);
  const [showIntroCarousel, setShowIntroCarousel] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <FullscreenHymnDisplay
        hymn={demoHymn}
        fontSize={fontSize}
        showIntroCarousel={showIntroCarousel}
        setShowIntroCarousel={setShowIntroCarousel}
      />
    </div>
  );
};

export default HymnViewerPage;
