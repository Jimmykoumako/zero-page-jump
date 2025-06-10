
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useEnhancedGroupSync } from "@/hooks/useEnhancedGroupSync";

interface UseHymnGroupSyncProps {
  groupSession?: {sessionId: string, isLeader: boolean} | null;
  userId: string;
  onHymnSelect: (hymnId: number) => void;
  onVerseChange: (verse: number) => void;
  onPlayChange: (isPlaying: boolean) => void;
}

export const useHymnGroupSync = ({
  groupSession,
  userId,
  onHymnSelect,
  onVerseChange,
  onPlayChange
}: UseHymnGroupSyncProps) => {
  const { toast } = useToast();
  const [groupState, groupActions] = useEnhancedGroupSync(userId);

  // Enhanced group sync event listeners
  useEffect(() => {
    if (!groupSession) return;

    const handleGroupHymnChange = (event: CustomEvent) => {
      const { hymnId } = event.detail;
      if (groupState.isFollowingLeader || groupState.isLeader) {
        onHymnSelect(hymnId);
        if (!groupState.isLeader && !groupState.isCoLeader) {
          toast({
            title: "Hymn Changed",
            description: "Leader changed the hymn",
          });
        }
      }
    };

    const handleGroupVerseChange = (event: CustomEvent) => {
      const { verse } = event.detail;
      if (groupState.isFollowingLeader || groupState.isLeader) {
        onVerseChange(verse);
        if (!groupState.isLeader && !groupState.isCoLeader) {
          toast({
            title: "Verse Changed",
            description: `Now on verse ${verse + 1}`,
          });
        }
      }
    };

    const handleGroupPlayChange = (event: CustomEvent) => {
      const { isPlaying: playing } = event.detail;
      if (groupState.isFollowingLeader || groupState.isLeader) {
        onPlayChange(playing);
      }
    };

    window.addEventListener('group-hymn-change', handleGroupHymnChange);
    window.addEventListener('group-verse-change', handleGroupVerseChange);
    window.addEventListener('group-play-change', handleGroupPlayChange);

    return () => {
      window.removeEventListener('group-hymn-change', handleGroupHymnChange);
      window.removeEventListener('group-verse-change', handleGroupVerseChange);
      window.removeEventListener('group-play-change', handleGroupPlayChange);
    };
  }, [groupSession, groupState.isLeader, groupState.isCoLeader, groupState.isFollowingLeader, onHymnSelect, onVerseChange, onPlayChange, toast]);

  const broadcastHymnChange = async (hymnId: number) => {
    if (groupSession && (groupState.isLeader || groupState.isCoLeader)) {
      await groupActions.broadcastHymnChange(hymnId);
    }
  };

  const broadcastVerseChange = async (verse: number) => {
    if (groupSession && (groupState.isLeader || groupState.isCoLeader)) {
      await groupActions.broadcastVerseChange(verse);
    }
  };

  const broadcastPlayState = async (isPlaying: boolean) => {
    if (groupSession && (groupState.isLeader || groupState.isCoLeader)) {
      await groupActions.broadcastPlayState(isPlaying);
    }
  };

  return {
    groupState,
    groupActions,
    broadcastHymnChange,
    broadcastVerseChange,
    broadcastPlayState
  };
};
