
import { useCallback } from "react";
import { useFullscreenPresentation } from "@/contexts/FullscreenPresentationContext";

export const useFullscreenSession = () => {
  const { state, dispatch } = useFullscreenPresentation();

  const setGroupSession = useCallback((session: { sessionId: string; isLeader: boolean } | null) => {
    dispatch({ type: 'SET_GROUP_SESSION', payload: session });
  }, [dispatch]);

  const isLeader = state.groupSession?.isLeader || false;
  const isInSession = !!state.groupSession;

  const leaveSession = useCallback(() => {
    setGroupSession(null);
  }, [setGroupSession]);

  const createSession = useCallback((sessionId: string) => {
    setGroupSession({ sessionId, isLeader: true });
  }, [setGroupSession]);

  const joinSession = useCallback((sessionId: string) => {
    setGroupSession({ sessionId, isLeader: false });
  }, [setGroupSession]);

  return {
    // State
    groupSession: state.groupSession,
    isLeader,
    isInSession,
    
    // Actions
    setGroupSession,
    leaveSession,
    createSession,
    joinSession,
  };
};
