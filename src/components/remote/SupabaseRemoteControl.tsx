
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Smartphone, Monitor } from "lucide-react";
import { hymns } from "@/data/hymns";
import { useSupabaseRemoteControl } from "@/hooks/useSupabaseRemoteControl";
import { useToast } from "@/hooks/use-toast";

interface SupabaseRemoteControlProps {
  onBack: () => void;
}

const SupabaseRemoteControl = ({ onBack }: SupabaseRemoteControlProps) => {
  const { toast } = useToast();
  const {
    deviceCode,
    connectedDeviceCode,
    isPresentation,
    isRemote,
    generateDeviceCode,
    connectToDevice,
    sendCommand
  } = useSupabaseRemoteControl();

  const [connectionInput, setConnectionInput] = useState("");
  const [selectedHymn, setSelectedHymn] = useState<number | null>(null);
  const [currentInput, setCurrentInput] = useState("");

  const handleStartPresentation = async () => {
    try {
      const code = await generateDeviceCode();
      if (code) {
        toast({
          title: "Presentation Mode Started",
          description: `Device code: ${code}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start presentation mode",
        variant: "destructive",
      });
    }
  };

  const handleConnectToDevice = async () => {
    if (!connectionInput.trim()) {
      toast({
        title: "Device Code Required",
        description: "Please enter a device code",
        variant: "destructive",
      });
      return;
    }

    try {
      await connectToDevice(connectionInput.trim().toUpperCase());
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to device",
        variant: "destructive",
      });
    }
  };

  const selectHymn = (hymnId: number) => {
    setSelectedHymn(hymnId);
    sendCommand('selectHymn', { hymnId });
  };

  const handleNumberInput = (num: number) => {
    setCurrentInput(prev => prev + num.toString());
  };

  const goToHymn = () => {
    if (currentInput) {
      const hymnNumber = parseInt(currentInput);
      sendCommand('goToHymn', { hymnNumber });
      setCurrentInput("");
    }
  };

  const clearInput = () => {
    setCurrentInput("");
  };

  const qrCodeUrl = deviceCode ? 
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`HYMNAL-REMOTE:${deviceCode}`)}` 
    : "";

  // Presentation Mode View
  if (isPresentation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Presentation Mode Active
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="p-8">
              <div className="text-center mb-6">
                <Monitor className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Presentation Mode</h1>
                <p className="text-slate-600">Remote control is ready for connection</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800 mb-2">{deviceCode}</div>
                    <div className="text-sm text-slate-600 mb-4">Device Code</div>
                  </div>
                </div>

                <div className="text-center">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code for remote control" 
                    className="w-32 h-32 border border-slate-200 rounded-lg mx-auto mb-2"
                  />
                  <p className="text-xs text-slate-500">Scan to connect remotely</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">Instructions:</h3>
                <ol className="text-sm text-slate-600 space-y-1">
                  <li>1. Open Remote Control on another device</li>
                  <li>2. Enter device code or scan QR code</li>
                  <li>3. Start controlling this presentation</li>
                </ol>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Remote Control View (when connected)
  if (isRemote && connectedDeviceCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Connected to {connectedDeviceCode}
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Playback Controls</h2>
              <div className="grid grid-cols-3 gap-4">
                <Button onClick={() => sendCommand('prevVerse')} size="lg" variant="outline">
                  <SkipBack className="w-6 h-6" />
                </Button>
                <Button onClick={() => sendCommand('togglePlay')} size="lg">
                  <Play className="w-6 h-6" />
                </Button>
                <Button onClick={() => sendCommand('nextVerse')} size="lg" variant="outline">
                  <SkipForward className="w-6 h-6" />
                </Button>
              </div>
              <p className="text-sm text-slate-600 mt-2 text-center">
                Use these controls to navigate between verses
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Hymn Selection</h2>
              <div className="grid grid-cols-4 gap-2">
                {hymns.slice(0, 12).map((hymn) => (
                  <Button
                    key={hymn.id}
                    onClick={() => selectHymn(hymn.id)}
                    variant={selectedHymn === hymn.id ? "default" : "outline"}
                    size="sm"
                    className="h-16 flex flex-col"
                  >
                    <div className="font-bold">#{hymn.number}</div>
                    <div className="text-xs text-center leading-tight">
                      {hymn.title.split(' ').slice(0, 2).join(' ')}
                    </div>
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Number Entry</h2>
              
              <div className="bg-slate-100 rounded-lg p-4 mb-4 text-center">
                <div className="text-2xl font-mono">
                  {currentInput || "___"}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  Enter hymn number
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <Button 
                    key={num} 
                    variant="outline" 
                    size="lg"
                    onClick={() => handleNumberInput(num)}
                  >
                    {num}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={clearInput}
                  className="text-red-600"
                >
                  Clear
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => handleNumberInput(0)}
                >
                  0
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={goToHymn}
                  disabled={!currentInput}
                  className="text-green-600"
                >
                  Go
                </Button>
              </div>

              <Button 
                className="w-full" 
                onClick={goToHymn}
                disabled={!currentInput}
              >
                Go to Hymn {currentInput || "___"}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Initial Connection View
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          <Card className="p-8">
            <div className="text-center mb-6">
              <Smartphone className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Remote Control</h1>
              <p className="text-slate-600">Control presentations remotely</p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-4">Start Presentation Mode</h3>
                <Button 
                  onClick={handleStartPresentation} 
                  className="w-full" 
                  size="lg"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Start Presentation
                </Button>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Generate a code for others to connect and control this device
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-slate-800 mb-4">Connect to Presentation</h3>
                <div className="space-y-3">
                  <Input
                    value={connectionInput}
                    onChange={(e) => setConnectionInput(e.target.value)}
                    placeholder="Enter device code"
                    className="text-center"
                  />
                  <Button 
                    onClick={handleConnectToDevice} 
                    className="w-full"
                    disabled={!connectionInput.trim()}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Connect as Remote
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-slate-800 mb-3">How to use:</h3>
            <div className="text-sm text-slate-600 space-y-2">
              <p><strong>Presentation Mode:</strong> Start this mode on the display device to generate a connection code.</p>
              <p><strong>Remote Control:</strong> Connect to a presentation device using its code to control it remotely.</p>
              <p><strong>Features:</strong> Control hymn selection, verse navigation, and playback remotely.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupabaseRemoteControl;
