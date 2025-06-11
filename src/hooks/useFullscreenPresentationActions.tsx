
import { useFullscreenPresentation } from "@/contexts/FullscreenPresentationContext";
import { useFullscreenNavigation } from "./useFullscreenNavigation";
import { useFullscreenSearch } from "./useFullscreenSearch";
import { useFullscreenAudioControls } from "./useFullscreenAudioControls";
import { useFullscreenDisplay } from "./useFullscreenDisplay";
import { useFullscreenSession } from "./useFullscreenSession";

export const useFullscreenPresentationActions = () => {
  const { state } = useFullscreenPresentation();
  
  // Use specialized hooks
  const navigation = useFullscreenNavigation();
  const search = useFullscreenSearch();
  const audioControls = useFullscreenAudioControls();
  const display = useFullscreenDisplay();
  const session = useFullscreenSession();

  return {
    // State
    state,
    
    // Navigation
    ...navigation,
    
    // Search and Buffer
    ...search,
    
    // Audio Controls
    ...audioControls,
    
    // Display Controls
    ...display,
    
    // Session Management
    ...session,
  };
};
