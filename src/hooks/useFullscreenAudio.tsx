
import { useState, useEffect } from "react";
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
  const { toast } = useToast();

  // Fetch audio files for the current hymn
  useEffect(() => {
    const fetchAudioFiles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('AudioFile')
          .select('*')
          .eq('hymnTitleNumber', hymnNumber)
          .order('createdAt', { ascending: false });

        if (error) throw error;
        setAudioFiles(data || []);
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

    fetchAudioFiles();
  }, [hymnNumber, toast]);

  const playAudio = (audioFile: AudioFile) => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
    }

    const audio = new Audio(audioFile.url);
    audio.addEventListener('loadstart', () => setLoading(true));
    audio.addEventListener('canplay', () => setLoading(false));
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentAudio(null);
      setCurrentAudioFile(null);
    });
    audio.addEventListener('error', () => {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load audio file.",
        variant: "destructive",
      });
    });

    setCurrentAudio(audio);
    setCurrentAudioFile(audioFile);
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(error => {
      console.error('Error playing audio:', error);
      toast({
        title: "Error",
        description: "Failed to play audio file.",
        variant: "destructive",
      });
    });
  };

  const togglePlayPause = () => {
    if (!currentAudio) return;

    if (isPlaying) {
      currentAudio.pause();
      setIsPlaying(false);
    } else {
      currentAudio.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Error playing audio:', error);
        toast({
          title: "Error",
          description: "Failed to play audio file.",
          variant: "destructive",
        });
      });
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
      setCurrentAudioFile(null);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
    };
  }, [currentAudio]);

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
