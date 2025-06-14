import FullscreenPresentation from "@/components/FullscreenPresentation";
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

const PresentationPage = () => {
  // You can replace this with real state/logic as needed
  const [currentVerse, setCurrentVerse] = useState(0);

  return (
    <div className="min-h-screen bg-black">
      <FullscreenPresentation
        hymn={demoHymn}
        currentVerse={currentVerse}
        onVerseChange={setCurrentVerse}
        onExit={() => window.history.back()}
      />
    </div>
  );
};

export default PresentationPage;
