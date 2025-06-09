
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, UserCheck, UserX, Settings, Clock, Lock, Share2, Copy, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FullscreenSessionManagementProps {
  isVisible: boolean;
  onClose: () => void;
  sessionDetails: any;
  participants: any[];
  isLeader: boolean;
  onPromoteToCoLeader: (participantId: string) => void;
  onRemoveParticipant: (participantId: string) => void;
  onUpdateSessionSettings: (settings: any) => void;
}

const FullscreenSessionManagement = ({
  isVisible,
  onClose,
  sessionDetails,
  participants,
  isLeader,
  onPromoteToCoLeader,
  onRemoveParticipant,
  onUpdateSessionSettings
}: FullscreenSessionManagementProps) => {
  const [settings, setSettings] = useState({
    title: sessionDetails?.title || '',
    description: sessionDetails?.description || '',
    passwordProtected: !!sessionDetails?.password_hash,
    password: '',
    allowParticipantControl: true
  });
  const { toast } = useToast();

  if (!isVisible) return null;

  const handleSaveSettings = () => {
    onUpdateSessionSettings({
      title: settings.title,
      description: settings.description,
      password_hash: settings.passwordProtected && settings.password ? btoa(settings.password) : null
    });
    
    toast({
      title: "Settings Updated",
      description: "Session settings have been saved successfully",
    });
  };

  const copySessionCode = async () => {
    try {
      await navigator.clipboard.writeText(sessionDetails?.session_code || '');
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

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Session Management</h2>
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Session Info */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Session Information</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Share2 className="w-3 h-3" />
                  {sessionDetails?.session_code}
                </Badge>
                <Button onClick={copySessionCode} variant="outline" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {isLeader && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Session Title</Label>
                  <Input
                    id="title"
                    value={settings.title}
                    onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter session title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={settings.description}
                    onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter session description"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="password-protection">Password Protection</Label>
                    <p className="text-sm text-gray-600">Require a password to join this session</p>
                  </div>
                  <Switch
                    id="password-protection"
                    checked={settings.passwordProtected}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, passwordProtected: checked }))}
                  />
                </div>

                {settings.passwordProtected && (
                  <div>
                    <Label htmlFor="password">Session Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={settings.password}
                      onChange={(e) => setSettings(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter session password"
                    />
                  </div>
                )}

                <Button onClick={handleSaveSettings} className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            )}
            
            {!isLeader && (
              <div className="text-gray-600">
                <p><strong>Title:</strong> {sessionDetails?.title || 'Untitled Session'}</p>
                {sessionDetails?.description && (
                  <p><strong>Description:</strong> {sessionDetails.description}</p>
                )}
                <p><strong>Created:</strong> {new Date(sessionDetails?.created_at).toLocaleDateString()}</p>
              </div>
            )}
          </Card>

          {/* Participants */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Participants ({participants.length})
              </h3>
            </div>

            <div className="space-y-3">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {participant.user_id === sessionDetails?.leader_id && (
                        <Crown className="w-4 h-4 text-yellow-600" />
                      )}
                      {participant.is_co_leader && participant.user_id !== sessionDetails?.leader_id && (
                        <Crown className="w-4 h-4 text-orange-600" />
                      )}
                      {participant.is_following_leader ? (
                        <UserCheck className="w-4 h-4 text-green-600" />
                      ) : (
                        <UserX className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {participant.device_name || `User ${participant.user_id?.slice(-4)}`}
                        </span>
                        {participant.user_id === sessionDetails?.leader_id && (
                          <Badge variant="secondary" className="text-xs">Leader</Badge>
                        )}
                        {participant.is_co_leader && participant.user_id !== sessionDetails?.leader_id && (
                          <Badge variant="outline" className="text-xs">Co-leader</Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {formatLastSeen(participant.last_seen)}
                        <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                          {participant.connection_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isLeader && participant.user_id !== sessionDetails?.leader_id && (
                    <div className="flex gap-2">
                      {!participant.is_co_leader && (
                        <Button
                          onClick={() => onPromoteToCoLeader(participant.id)}
                          variant="outline"
                          size="sm"
                        >
                          Promote
                        </Button>
                      )}
                      <Button
                        onClick={() => onRemoveParticipant(participant.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Session Statistics */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Session Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{participants.length}</div>
                <div className="text-sm text-gray-600">Total Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {participants.filter(p => p.connection_status === 'connected').length}
                </div>
                <div className="text-sm text-gray-600">Online Now</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {participants.filter(p => p.is_co_leader).length}
                </div>
                <div className="text-sm text-gray-600">Co-leaders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {participants.filter(p => p.is_following_leader).length}
                </div>
                <div className="text-sm text-gray-600">Following Leader</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FullscreenSessionManagement;
