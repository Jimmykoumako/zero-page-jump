
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Monitor, Users, QrCode, ArrowLeft } from "lucide-react";
import { useSupabaseRemoteControl } from "@/hooks/useSupabaseRemoteControl";
import { useSupabaseGroupSync } from "@/hooks/useSupabaseGroupSync";
import FullscreenPresentation from "@/components/FullscreenPresentation";
import SupabaseGroupSession from "@/components/session/SupabaseGroupSession";
import { hymns } from "@/data/hymns";

interface SupabasePresentationModeProps {
  onBack: () => void;
}

const SupabasePresentationMode = ({ onBack }: SupabasePresentationModeProps) => {
  const [currentView, setCurrentView] = useState<'setup' | 'fullscreen' | 'group-session'>('setup');
  const [currentHymn, setCurrentHymn] = useState<any>(null);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [groupSessionData, setGroupSessionData] = useState<any>(null);

  const {
    deviceCode,
    isPresentation,
    generateDeviceCode
  } = useSupabaseRemoteControl();

  const [groupState, groupActions] = useSupabaseGroupSync();

  // Listen for remote control commands
  useEffect(() => {
    const handleHymnSelect = (event: CustomEvent) => {
      const { hymnId } = event.detail;
      const hymn = hymns.find(h => h.id === hymnId);
      if (hymn) {
        setCurrentHymn(hymn);
        setCurrentVerse(0);
      }
    };

    const handleGoToHymn = (event: CustomEvent) => {
      const { hymnNumber } = event.detail;
      const hymn = hymns.find(h => h.number === hymnNumber.toString());
      if (hymn) {
        setCurrentHymn(hymn);
        setCurrentVerse(0);
      }
    };

    const handleNextVerse = () => {
      if (currentHymn && currentVerse < currentHymn.verses.length - 1) {
        setCurrentVerse(prev => prev + 1);
      }
    };

    const handlePrevVerse = () => {
      if (currentVerse > 0) {
        setCurrentVerse(prev => prev - 1);
      }
    };

    window.addEventListener('remote-command-selectHymn', handleHymnSelect as EventListener);
    window.addEventListener('remote-command-goToHymn', handleGoToHymn as EventListener);
    window.addEventListener('remote-command-nextVerse', handleNextVerse);
    window.addEventListener('remote-command-prevVerse', handlePrevVerse);

    return () => {
      window.removeEventListener('remote-command-selectHymn', handleHymnSelect as EventListener);
      window.removeEventListener('remote-command-goToHymn', handleGoToHymn as EventListener);
      window.removeEventListener('remote-command-nextVerse', handleNextVerse);
      window.removeEventListener('remote-command-prevVerse', handlePrevVerse);
    };
  }, [currentHymn, currentVerse]);

  // Listen for group session changes
  useEffect(() => {
    const handleGroupHymnChange = (event: CustomEvent) => {
      const { hymnId } = event.detail;
      const hymn = hymns.find(h => h.id.toString() === hymnId);
      if (hymn) {
        setCurrentHymn(hymn);
      }
    };

    const handleGroupVerseChange = (event: CustomEvent) => {
      const { verse } = event.detail;
      setCurrentVerse(verse);
    };

    window.addEventListener('group-hymn-change', handleGroupHymnChange as EventListener);
    window.addEventListener('group-verse-change', handleGroupVerseChange as EventListener);

    return () => {
      window.removeEventListener('group-hymn-change', handleGroupHymnChange as EventListener);
      window.removeEventListener('group-verse-change', handleGroupVerseChange as EventListener);
    };
  }, []);

  const startPresentationMode = async () => {
    await generateDeviceCode();
    // Use demo hymn for initial display
    setCurrentHymn(hymns[0]);
    setCurrentVerse(0);
    setCurrentView('fullscreen');
  };

  const startGroupSession = () => {
    setCurrentView('group-session');
  };

  const handleGroupSessionStart = (sessionData: any) => {
    setGroupSessionData(sessionData);
    setCurrentHymn(hymns[0]); // Start with first hymn
    setCurrentVerse(0);
    setCurrentView('fullscreen');
  };

  const handleExitFullscreen = () => {
    setCurrentView('setup');
    setCurrentHymn(null);
    setCurrentVerse(0);
  };

  const handleVerseChange = async (verse: number) => {
    setCurrentVerse(verse);
    if (groupSessionData && (groupState.isLeader || groupState.isCoLeader)) {
      await groupActions.broadcastVerseChange(verse);
    }
  };

  const handleHymnSelect = async (hymn: any) => {
    setCurrentHymn(hymn);
    setCurrentVerse(0);
    if (groupSessionData && (groupState.isLeader || groupState.isCoLeader)) {
      await groupActions.broadcastHymnChange(hymn.id.toString());
    }
  };

  if (currentView === 'group-session') {
    return (
      <SupabaseGroupSession
        onBack={() => setCurrentView('setup')}
        onSessionStart={handleGroupSessionStart}
      />
    );
  }

  if (currentView === 'fullscreen' && currentHymn) {
    return (
      <FullscreenPresentation
        hymn={currentHymn}
        currentVerse={currentVerse}
        onVerseChange={handleVerseChange}
        onExit={handleExitFullscreen}
        deviceId={deviceCode}
        groupSession={groupSessionData}
        onHymnSelect={handleHymnSelect}
      />
    );
  }

  const qrCodeUrl = deviceCode ? 
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`HYMNAL-REMOTE:${deviceCode}`)}` 
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Monitor className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Presentation Mode</h1>
            <p className="text-slate-600">Choose how you want to present hymns</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={startPresentationMode}>
              <div className="text-center">
                <Monitor className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Solo Presentation</h3>
                <p className="text-slate-600 mb-4">
                  Present hymns with remote control capability
                </p>
                <Button className="w-full">
                  Start Solo Mode
                </Button>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={startGroupSession}>
              <div className="text-center">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Group Session</h3>
                <p className="text-slate-600 mb-4">
                  Synchronized presentation with multiple participants
                </p>
                <Button variant="outline" className="w-full">
                  Start Group Mode
                </Button>
              </div>
            </Card>
          </div>

          {isPresentation && deviceCode && (
            <Card className="mt-8 p-6">
              <div className="text-center">
                <QrCode className="w-8 h-8 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Remote Control Ready</h3>
                <div className="bg-slate-100 rounded-lg p-4 mb-4">
                  <div className="text-2xl font-bold text-slate-800 mb-2">{deviceCode}</div>
                  <div className="text-sm text-slate-600">Device Code</div>
                </div>
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code for remote control" 
                  className="w-24 h-24 border border-slate-200 rounded-lg mx-auto mb-4"
                />
                <p className="text-sm text-slate-600">
                  Use this code or QR code to connect a remote control device
                </p>
              </div>
            </Card>
          )}

          <Card className="mt-8 p-6">
            <h3 className="font-semibold text-slate-800 mb-3">Features</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Solo Mode:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Remote control capability</li>
                  <li>• QR code connection</li>
                  <li>• Fullscreen presentation</li>
                  <li>• Keyboard navigation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Group Mode:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Real-time synchronization</li>
                  <li>• Multiple participants</li>
                  <li>• Leader/participant roles</li>
                  <li>• Session management</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupabasePresentationMode;
