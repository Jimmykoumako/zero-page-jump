
import { Button } from "@/components/ui/button";
import { Users, Crown, UserCheck, UserX } from "lucide-react";

interface FullscreenSessionControlsProps {
  groupSession: { sessionId: string; isLeader: boolean } | null;
  currentHymn: number;
  setCurrentHymn: (id: number) => void;
}

const FullscreenSessionControls = ({
  groupSession,
  currentHymn,
  setCurrentHymn
}: FullscreenSessionControlsProps) => {
  if (!groupSession) return null;

  const isInSession = true;
  const isLeader = groupSession.isLeader;
  const isCoLeader = false;
  const isFollowingLeader = !isLeader;
  const participantCount = 1;

  const onToggleFollowLeader = () => {
    // Toggle follow leader logic
  };

  const onSessionManagement = () => {
    // Session management logic
  };

  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-2 z-50">
      <Button
        onClick={onSessionManagement}
        variant="outline"
        size="sm"
        className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm h-10 px-3"
        title={isLeader ? "Manage Session" : "View Session Info"}
      >
        {isLeader ? <Crown className="w-4 h-4 mr-2" /> : <Users className="w-4 h-4 mr-2" />}
        {participantCount}
      </Button>
      
      {!isLeader && !isCoLeader && (
        <Button
          onClick={onToggleFollowLeader}
          variant="outline"
          size="sm"
          className={`bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm h-10 px-3 ${
            isFollowingLeader ? 'bg-green-500/50 border-green-400/30' : 'bg-orange-500/50 border-orange-400/30'
          }`}
          title={isFollowingLeader ? "Click to navigate independently" : "Click to follow leader"}
        >
          {isFollowingLeader ? <UserCheck className="w-4 h-4 mr-2" /> : <UserX className="w-4 h-4 mr-2" />}
          {isFollowingLeader ? 'Following' : 'Independent'}
        </Button>
      )}
      
      {isCoLeader && (
        <div className="text-xs text-white/80 bg-black/30 rounded px-2 py-1 backdrop-blur-sm">
          Co-leader
        </div>
      )}
    </div>
  );
};

export default FullscreenSessionControls;
