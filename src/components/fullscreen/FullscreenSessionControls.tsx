
import { Button } from "@/components/ui/button";
import { Users, Crown, UserCheck, UserX } from "lucide-react";

interface FullscreenSessionControlsProps {
  isInSession: boolean;
  isLeader: boolean;
  isCoLeader: boolean;
  isFollowingLeader: boolean;
  participantCount: number;
  onToggleFollowLeader: () => void;
  onSessionManagement: () => void;
}

const FullscreenSessionControls = ({
  isInSession,
  isLeader,
  isCoLeader,
  isFollowingLeader,
  participantCount,
  onToggleFollowLeader,
  onSessionManagement
}: FullscreenSessionControlsProps) => {
  if (!isInSession) return null;

  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-2 z-50">
      <Button
        onClick={onSessionManagement}
        variant="outline"
        size="sm"
        className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm h-10 px-3"
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
            isFollowingLeader ? 'bg-green-500/50' : 'bg-orange-500/50'
          }`}
        >
          {isFollowingLeader ? <UserCheck className="w-4 h-4 mr-2" /> : <UserX className="w-4 h-4 mr-2" />}
          {isFollowingLeader ? 'Following' : 'Independent'}
        </Button>
      )}
    </div>
  );
};

export default FullscreenSessionControls;
