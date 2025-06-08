
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AudioFile {
  id: string;
  url: string;
  audioTypeId: number;
  userId: string;
  createdAt: string;
  hymnTitleNumber?: string;
  bookId?: number;
}

export const useFullscreenAudio = (hymnNumber: string) => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioFile, setCurrentAudioFile] = useState<AudioFile | null>(null);
  const [loading, setLoading] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Fetch audio files for the current hymn
  useEffect(() => {
    const fetchAudioFiles = async () => {
      setLoading(true);
      try {
        // Fetch from both AudioFile and uploads tables
        const [audioFileResult, uploadsResult] = await Promise.all([
          supabase
            .from('AudioFile')
            .select('*')
            .eq('hymnTitleNumber', hymnNumber)
            .order('createdAt', { ascending: false }),
          supabase
            .from('uploads')
            .select('*')
            .eq('hymnTitle', hymnNumber)
            .order('createdAt', { ascending: false })
        ]);

        const combinedFiles: AudioFile[] = [];

        // Add AudioFile records
        if (audioFileResult.data) {
          combinedFiles.push(...audioFileResult.data.map(file => ({
            id: file.id,
            url: file.url,
            audioTypeId: file.audioTypeId,
            userId: file.userId,
            createdAt: file.createdAt,
            hymnTitleNumber: file.hymnTitleNumber,
            bookId: file.bookId
          })));
        }

        // Add uploads records
        if (uploadsResult.data) {
          combinedFiles.push(...uploadsResult.data.map(upload => ({
            id: upload.id,
            url: upload.url,
            audioTypeId: upload.audioTypeId,
            userId: upload.userId,
            createdAt: upload.createdAt,
            hymnTitleNumber: upload.hymnTitle,
            bookId: upload.bookId
          })));
        }

        setAudioFiles(combinedFiles);

        if (audioFileResult.error) {
          console.error('Error fetching AudioFile records:', audioFileResult.error);
        }
        if (uploadsResult.error) {
          console.error('Error fetching uploads records:', uploadsResult.error);
        }
      } catch (error) {
        console.error('Error fetching audio files:', error);
        toast({
          title: "Error",
          description: "Failed to load audio files.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (hymnNumber) {
      fetchAudioFiles();
    }
  }, [hymnNumber, toast]);

  // Start progress tracking
  const startProgressTracking = (audio: HTMLAudioElement) => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(() => {
      if (audio && !audio.paused && !audio.ended) {
        // Force re-render to update progress bar
        setCurrentAudio(audio);
      }
    }, 100);
  };

  // Stop progress tracking
  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const playAudio = (audioFile: AudioFile) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      stopProgressTracking();
      setCurrentAudio(null);
      setIsPlaying(false);
    }

    setLoading(true);
    const audio = new Audio(audioFile.url);
    
    // Set up event listeners
    audio.addEventListener('loadstart', () => setLoading(true));
    audio.addEventListener('canplay', () => setLoading(false));
    audio.addEventListener('loadeddata', () => setLoading(false));
    
    audio.addEventListener('play', () => {
      setIsPlaying(true);
      startProgressTracking(audio);
    });
    
    audio.addEventListener('pause', () => {
      setIsPlaying(false);
      stopProgressTracking();
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      stopProgressTracking();
      setCurrentAudio(null);
      setCurrentAudioFile(null);
    });
    
    audio.addEventListener('error', (e) => {
      setLoading(false);
      console.error('Audio error:', e);
      toast({
        title: "Error",
        description: "Failed to load audio file. Please check the file format and try again.",
        variant: "destructive",
      });
    });

    // Start playing
    setCurrentAudio(audio);
    setCurrentAudioFile(audioFile);
    
    audio.play().then(() => {
      setLoading(false);
    }).catch(error => {
      setLoading(false);
      console.error('Error playing audio:', error);
      toast({
        title: "Playback Error",
        description: "Unable to play audio file. This may be due to browser restrictions or file format issues.",
        variant: "destructive",
      });
    });
  };

  const togglePlayPause = () => {
    if (!currentAudio) return;

    if (isPlaying) {
      currentAudio.pause();
    } else {
      currentAudio.play().catch(error => {
        console.error('Error playing audio:', error);
        toast({
          title: "Playback Error",
          description: "Unable to resume audio playback.",
          variant: "destructive",
        });
      });
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      stopProgressTracking();
      setIsPlaying(false);
      setCurrentAudio(null);
      setCurrentAudioFile(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        stopProgressTracking();
      }
    };
  }, []);

  // Cleanup when hymn number changes
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        stopProgressTracking();
        setCurrentAudio(null);
        setCurrentAudioFile(null);
        setIsPlaying(false);
      }
    };
  }, [hymnNumber]);

  return {
    audioFiles,
    currentAudio,
    isPlaying,
    currentAudioFile,
    loading,
    playAudio,
    togglePlayPause,
    stopAudio
  };
};
