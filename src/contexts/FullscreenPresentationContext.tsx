
import { createContext, useContext, useReducer, ReactNode } from "react";
import { Hymn } from "@/types/hymn";

// State interface
interface FullscreenPresentationState {
  // Hymn data
  currentHymn: string;
  showIntroCarousel: boolean;
  
  // Audio state
  playingHymn: Hymn | null;
  currentAudio: HTMLAudioElement | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  
  // UI state
  fontSize: number;
  isSearchOpen: boolean;
  isBufferVisible: boolean;
  isAutoScrollEnabled: boolean;
  autoScrollSpeed: number;
  
  // Session data
  selectedHymnbook: any;
  groupSession: { sessionId: string; isLeader: boolean } | null;
}

// Actions
type FullscreenPresentationAction =
  | { type: 'SET_CURRENT_HYMN'; payload: string }
  | { type: 'SET_SHOW_INTRO_CAROUSEL'; payload: boolean }
  | { type: 'SET_PLAYING_HYMN'; payload: Hymn | null }
  | { type: 'SET_CURRENT_AUDIO'; payload: HTMLAudioElement | null }
  | { type: 'SET_IS_PLAYING'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_FONT_SIZE'; payload: number }
  | { type: 'SET_IS_SEARCH_OPEN'; payload: boolean }
  | { type: 'SET_IS_BUFFER_VISIBLE'; payload: boolean }
  | { type: 'SET_IS_AUTO_SCROLL_ENABLED'; payload: boolean }
  | { type: 'SET_AUTO_SCROLL_SPEED'; payload: number }
  | { type: 'SET_SELECTED_HYMNBOOK'; payload: any }
  | { type: 'SET_GROUP_SESSION'; payload: { sessionId: string; isLeader: boolean } | null };

// Initial state
const initialState: FullscreenPresentationState = {
  currentHymn: "",
  showIntroCarousel: true,
  playingHymn: null,
  currentAudio: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  fontSize: 18,
  isSearchOpen: false,
  isBufferVisible: false,
  isAutoScrollEnabled: false,
  autoScrollSpeed: 50,
  selectedHymnbook: null,
  groupSession: null,
};

// Reducer
function fullscreenPresentationReducer(
  state: FullscreenPresentationState,
  action: FullscreenPresentationAction
): FullscreenPresentationState {
  switch (action.type) {
    case 'SET_CURRENT_HYMN':
      return { ...state, currentHymn: action.payload };
    case 'SET_SHOW_INTRO_CAROUSEL':
      return { ...state, showIntroCarousel: action.payload };
    case 'SET_PLAYING_HYMN':
      return { ...state, playingHymn: action.payload };
    case 'SET_CURRENT_AUDIO':
      return { ...state, currentAudio: action.payload };
    case 'SET_IS_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.payload };
    case 'SET_IS_SEARCH_OPEN':
      return { ...state, isSearchOpen: action.payload };
    case 'SET_IS_BUFFER_VISIBLE':
      return { ...state, isBufferVisible: action.payload };
    case 'SET_IS_AUTO_SCROLL_ENABLED':
      return { ...state, isAutoScrollEnabled: action.payload };
    case 'SET_AUTO_SCROLL_SPEED':
      return { ...state, autoScrollSpeed: action.payload };
    case 'SET_SELECTED_HYMNBOOK':
      return { ...state, selectedHymnbook: action.payload };
    case 'SET_GROUP_SESSION':
      return { ...state, groupSession: action.payload };
    default:
      return state;
  }
}

// Context
interface FullscreenPresentationContextType {
  state: FullscreenPresentationState;
  dispatch: React.Dispatch<FullscreenPresentationAction>;
}

const FullscreenPresentationContext = createContext<FullscreenPresentationContextType | undefined>(undefined);

// Provider component
interface FullscreenPresentationProviderProps {
  children: ReactNode;
  initialData?: Partial<FullscreenPresentationState>;
}

export const FullscreenPresentationProvider = ({ 
  children, 
  initialData 
}: FullscreenPresentationProviderProps) => {
  const [state, dispatch] = useReducer(
    fullscreenPresentationReducer,
    { ...initialState, ...initialData }
  );

  return (
    <FullscreenPresentationContext.Provider value={{ state, dispatch }}>
      {children}
    </FullscreenPresentationContext.Provider>
  );
};

// Hook to use the context
export const useFullscreenPresentation = () => {
  const context = useContext(FullscreenPresentationContext);
  if (context === undefined) {
    throw new Error('useFullscreenPresentation must be used within a FullscreenPresentationProvider');
  }
  return context;
};
