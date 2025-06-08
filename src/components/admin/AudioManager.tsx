import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Trash2, Play, Pause } from "lucide-react";

const AudioManager = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [audioTypes, setAudioTypes] = useState([]);
  const [hymns, setHymns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    hymnTitleNumber: '',
    audioTypeId: 1,
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [audioResult, typesResult, hymnsResult] = await Promise.all([
        supabase.from('AudioFile').select('*').order('createdAt', { ascending: false }),
        supabase.from('AudioType').select('*'),
        supabase.from('HymnTitle').select('number, titles')
      ]);

      if (audioResult.error) throw audioResult.error;
      if (typesResult.error) throw typesResult.error;
      if (hymnsResult.error) throw hymnsResult.error;

      setAudioFiles(audioResult.data || []);
      setAudioTypes(typesResult.data || []);
      setHymns(hymnsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(filePath);

      // Save audio file record - generate a unique ID
      const audioFileId = crypto.randomUUID();
      const currentUser = await supabase.auth.getUser();
      
      const { error: insertError } = await supabase
        .from('AudioFile')
        .insert({
          id: audioFileId,
          url: publicUrl,
          hymnTitleNumber: uploadForm.hymnTitleNumber,
          audioTypeId: uploadForm.audioTypeId,
          userId: currentUser.data.user.id
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Audio file uploaded successfully.",
      });

      setSelectedFile(null);
      setUploadForm({ hymnTitleNumber: '', audioTypeId: 1, description: '' });
      fetchData();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload audio file.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (audioFile) => {
    if (!confirm('Are you sure you want to delete this audio file?')) return;

    try {
      // Extract file path from URL
      const url = new URL(audioFile.url);
      const filePath = url.pathname.split('/').pop();

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('audio-files')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('AudioFile')
        .delete()
        .eq('id', audioFile.id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Audio file deleted successfully.",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete audio file.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading audio files...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Audio File Management</h2>
        
        {/* Upload Form */}
        <Card className="p-4 mb-6 bg-blue-50">
          <h3 className="text-lg font-semibold mb-4">Upload New Audio File</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="hymnNumber">Hymn Number</Label>
              <select
                id="hymnNumber"
                value={uploadForm.hymnTitleNumber}
                onChange={(e) => setUploadForm({ ...uploadForm, hymnTitleNumber: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select hymn</option>
                {hymns.map((hymn) => (
                  <option key={hymn.number} value={hymn.number}>
                    #{hymn.number} - {hymn.titles?.[0]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="audioType">Audio Type</Label>
              <select
                id="audioType"
                value={uploadForm.audioTypeId}
                onChange={(e) => setUploadForm({ ...uploadForm, audioTypeId: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {audioTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type} - {type.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="file">Audio File</Label>
              <Input
                id="file"
                type="file"
                accept="audio/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>
          </div>
          <Button onClick={handleFileUpload} disabled={uploading || !selectedFile}>
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </Card>

        {/* Audio Files List */}
        <div className="space-y-4">
          {audioFiles.map((audioFile) => (
            <Card key={audioFile.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    Hymn #{audioFile.hymnTitleNumber}
                  </h3>
                  <p className="text-slate-600">
                    Type: {audioTypes.find(t => t.id === audioFile.audioTypeId)?.type}
                  </p>
                  <div className="text-sm text-slate-500 mt-2">
                    Uploaded: {new Date(audioFile.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <audio controls className="max-w-xs">
                    <source src={audioFile.url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <Button
                    onClick={() => handleDelete(audioFile)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AudioManager;
