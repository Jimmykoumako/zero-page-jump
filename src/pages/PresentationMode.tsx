
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Play, ArrowLeft, Monitor } from "lucide-react";
import { hymns } from "@/data/hymns";
import FullscreenPresentation from "@/components/FullscreenPresentation";
import { Hymn } from "@/types/hymn";

const PresentationMode = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHymn, setSelectedHymn] = useState<Hymn | null>(null);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredHymns = hymns.filter(hymn =>
    hymn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hymn.number.toString().includes(searchTerm) ||
    hymn.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartPresentation = (hymn: Hymn) => {
    setSelectedHymn(hymn);
    setCurrentVerse(0);
    setIsFullscreen(true);
  };

  const handleExitPresentation = () => {
    setIsFullscreen(false);
    setSelectedHymn(null);
    setCurrentVerse(0);
  };

  if (isFullscreen && selectedHymn) {
    return (
      <FullscreenPresentation
        hymn={selectedHymn}
        currentVerse={currentVerse}
        onVerseChange={setCurrentVerse}
        onExit={handleExitPresentation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Presentation Mode</h1>
                <p className="text-gray-600">Display hymns beautifully for congregation viewing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search hymns by title, number, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Hymns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHymns.slice(0, 12).map((hymn) => (
            <Card 
              key={hymn.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-200"
              onClick={() => handleStartPresentation(hymn)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-bold">{hymn.number}</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{hymn.title}</CardTitle>
                      {hymn.author && (
                        <p className="text-sm text-gray-600 mt-1">by {hymn.author}</p>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0">
                    <Play className="w-4 h-4 mr-1" />
                    Present
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  {hymn.verses?.length || 0} verses
                  {hymn.chorus && " • Chorus"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHymns.length === 0 && (
          <div className="text-center py-12">
            <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hymns found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Presentation Mode Features</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Navigation</h4>
              <ul className="space-y-1">
                <li>• Arrow keys to navigate verses</li>
                <li>• Spacebar to advance</li>
                <li>• Home/End for first/last verse</li>
                <li>• Esc to exit fullscreen</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Display Options</h4>
              <ul className="space-y-1">
                <li>• Customizable font size</li>
                <li>• Auto-scroll functionality</li>
                <li>• Clean, distraction-free display</li>
                <li>• Perfect for projection screens</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationMode;
