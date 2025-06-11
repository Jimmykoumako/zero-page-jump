
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AudioFile } from "@/types/fullscreen-audio";

export const useAudioFiles = (hymnNumber: string) => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  return { audioFiles, loading };
};
