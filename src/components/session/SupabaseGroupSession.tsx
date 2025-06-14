
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QrCode, Users, Copy, Check, Crown, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseGroupSync } from "@/hooks/useSupabaseGroupSync";
import ParticipantsList from "./ParticipantsList";

interface SupabaseGroupSessionProps {
  onBack: () => void;
  onSessionStart: (sessionData: any) => void;
}

const SupabaseGroupSession = ({ onBack, onSessionStart }: SupabaseGroupSessionProps) => {
  const { toast } = useToast();
  const [groupState, groupActions] = useSupabaseGroupSync();
  
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [sessionPassword, setSessionPassword] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const createSession = async () => {
    if (!sessionTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a session title",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const sessionCode = await groupActions.createSession({
        title: sessionTitle,
        description: sessionDescription,
        password: sessionPassword,
      });
      
      onSessionStart({
        sessionId: groupState.sessionId,
        sessionCode,
        isLeader: true
      });
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const joinSession = async () => {
    if (!joinCode.trim()) {
      toast({
        title: "Code Required",
        description: "Please enter a session code",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      await groupActions.joinSession(joinCode, joinPassword);
      
      onSessionStart({
        sessionId: groupState.sessionId,
        sessionCode: joinCode,
        isLeader: false
      });
    } catch (error) {
      console.error('Error joining session:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join session",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const copySessionCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied",
        description: "Session code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const qrCodeUrl = groupState.sessionDetails?.session_code ? 
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`HYMNAL-GROUP:${groupState.sessionDetails.session_code}`)}` 
    : "";

  if (groupState.sessionId && groupState.sessionDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button onClick={onBack} variant="outline">
              ← Back to Home
            </Button>
            <Button 
              onClick={groupActions.leaveSession}
              variant="destructive"
            >
              Leave Session
            </Button>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                  {groupState.isLeader && <Crown className="w-6 h-6 text-yellow-600" />}
                  {groupState.isCoLeader && <Crown className="w-6 h-6 text-orange-600" />}
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                  {groupState.sessionDetails.title}
                </h1>
                {groupState.sessionDetails.description && (
                  <p className="text-slate-600 mb-4">{groupState.sessionDetails.description}</p>
                )}
                <div className="bg-slate-100 rounded-lg p-4 mb-4">
                  <div className="text-2xl font-bold text-slate-800 mb-2">
                    {groupState.sessionDetails.session_code}
                  </div>
                  <div className="text-sm text-slate-600">
                    {groupState.isLeader ? 'You are the session leader' : 
                     groupState.isCoLeader ? 'You are a co-leader' : 
                     'You are a participant'}
                  </div>
                </div>

                {groupState.isLeader && (
                  <>
                    <div className="flex gap-2 mb-4 justify-center">
                      <Button 
                        onClick={() => copySessionCode(groupState.sessionDetails.session_code)} 
                        variant="outline"
                      >
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? 'Copied!' : 'Copy Code'}
                      </Button>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">QR Code</h3>
                      <div className="flex justify-center">
                        <img 
                          src={qrCodeUrl} 
                          alt="Session QR Code" 
                          className="w-32 h-32 border border-slate-200 rounded-lg"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Scan to join session</p>
                    </div>
                  </>
                )}

                {!groupState.isLeader && !groupState.isCoLeader && (
                  <div className="mb-4">
                    <Button 
                      onClick={groupActions.toggleFollowLeader}
                      variant="outline"
                      className={`${
                        groupState.isFollowingLeader ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
                      }`}
                    >
                      {groupState.isFollowingLeader ? 
                        <><UserCheck className="w-4 h-4 mr-2" /> Following Leader</> : 
                        <><UserX className="w-4 h-4 mr-2" /> Independent Mode</>
                      }
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <ParticipantsList
              participants={groupState.participants}
              sessionDetails={groupState.sessionDetails}
              isLeader={groupState.isLeader}
              onPromoteToCoLeader={groupActions.promoteToCoLeader}
              onRemoveParticipant={groupActions.removeParticipant}
            />

            <Card className="p-6">
              <h3 className="font-semibold text-slate-800 mb-3">Session Controls</h3>
              <div className="space-y-3">
                <div className="text-sm text-slate-600">
                  Current Status: 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    groupState.connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                    groupState.connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {groupState.connectionStatus}
                  </span>
                </div>
                {groupState.selectedHymn && (
                  <div className="text-sm text-slate-600">
                    Current Hymn: <span className="font-semibold">{groupState.selectedHymn}</span>
                  </div>
                )}
                {groupState.selectedHymn && (
                  <div className="text-sm text-slate-600">
                    Current Verse: <span className="font-semibold">{groupState.currentVerse + 1}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button onClick={onBack} variant="outline">
            ← Back to Home
          </Button>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          <Card className="p-8">
            <div className="text-center mb-6">
              <Users className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Group Session</h1>
              <p className="text-slate-600">Create or join a group session for synchronized hymn navigation</p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-4">Create New Session</h3>
                <div className="space-y-3">
                  <Input
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    placeholder="Session title"
                  />
                  <Input
                    value={sessionDescription}
                    onChange={(e) => setSessionDescription(e.target.value)}
                    placeholder="Description (optional)"
                  />
                  <Input
                    type="password"
                    value={sessionPassword}
                    onChange={(e) => setSessionPassword(e.target.value)}
                    placeholder="Password (optional)"
                  />
                  <Button 
                    onClick={createSession} 
                    className="w-full" 
                    size="lg"
                    disabled={isCreating}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {isCreating ? 'Creating...' : 'Create Session'}
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-slate-800 mb-4">Join Existing Session</h3>
                <div className="space-y-3">
                  <Input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.slice(0, 4))}
                    placeholder="Enter 4-digit code"
                    className="text-center text-lg"
                    maxLength={4}
                  />
                  <Input
                    type="password"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    placeholder="Password (if required)"
                  />
                  <Button 
                    onClick={joinSession} 
                    className="w-full"
                    disabled={joinCode.length !== 4 || isJoining}
                  >
                    {isJoining ? 'Joining...' : 'Join Session'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-slate-800 mb-3">How it works</h3>
            <div className="text-sm text-slate-600 space-y-2">
              <p><strong>Leaders:</strong> Create a session and share the 4-digit code with participants.</p>
              <p><strong>Participants:</strong> Join using the code to follow along with the leader's navigation.</p>
              <p><strong>Sync:</strong> All participants will see the same hymn and verse as the leader in real-time.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupabaseGroupSession;
