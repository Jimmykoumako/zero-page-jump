
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, Music, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AudioUploadData } from '@/types/audio-track';

interface AudioUploadProps {
  onUploadComplete: () => void;
  onCancel: () => void;
}

const AudioUpload = ({ onUploadComplete, onCancel }: AudioUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [formData, setFormData] = useState<AudioUploadData>({
    hymn_number: '',
    hymn_title: '',
    book_id: 1,
    title: '',
    artist_name: '',
    album_name: '',
    audio_type: 'instrumental',
    tempo: undefined,
    key_signature: '',
    is_public: false,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const audioFile = droppedFiles.find(file => file.type.startsWith('audio/'));
    
    if (audioFile) {
      setFile(audioFile);
      if (!formData.title) {
        setFormData(prev => ({ ...prev, title: audioFile.name.replace(/\.[^/.]+$/, '') }));
      }
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!formData.title) {
        setFormData(prev => ({ ...prev, title: selectedFile.name.replace(/\.[^/.]+$/, '') }));
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('audio_files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get audio duration
      const audio = new Audio();
      const duration = await new Promise<number>((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
          resolve(Math.floor(audio.duration));
        });
        audio.src = URL.createObjectURL(file);
      });

      // Create database record
      const { error: dbError } = await supabase
        .from('audio_tracks')
        .insert({
          user_id: user.id,
          hymn_number: formData.hymn_number,
          hymn_title: formData.hymn_title,
          book_id: formData.book_id,
          title: formData.title,
          artist_name: formData.artist_name || null,
          album_name: formData.album_name || null,
          duration,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type,
          audio_type: formData.audio_type,
          tempo: formData.tempo || null,
          key_signature: formData.key_signature || null,
          is_public: formData.is_public,
          upload_status: 'ready'
        });

      if (dbError) throw dbError;

      toast({
        title: "Upload successful",
        description: "Your audio file has been uploaded successfully.",
      });
      
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload audio file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const isValid = file && formData.hymn_number && formData.hymn_title && formData.title;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Upload Audio File
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? 'border-primary bg-primary/5'
                : file
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {file ? (
              <div className="space-y-2">
                <Music className="w-12 h-12 mx-auto text-green-500" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <p className="text-lg font-medium">Drop your audio file here</p>
                <p className="text-gray-500">or click to browse</p>
                <p className="text-sm text-gray-400">
                  Supports MP3, WAV, FLAC, and other audio formats
                </p>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hymn-number">Hymn Number *</Label>
              <Input
                id="hymn-number"
                value={formData.hymn_number}
                onChange={(e) => setFormData(prev => ({ ...prev, hymn_number: e.target.value }))}
                placeholder="e.g., 123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hymn-title">Hymn Title *</Label>
              <Input
                id="hymn-title"
                value={formData.hymn_title}
                onChange={(e) => setFormData(prev => ({ ...prev, hymn_title: e.target.value }))}
                placeholder="e.g., Amazing Grace"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Track Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Piano Instrumental"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist">Artist Name</Label>
              <Input
                id="artist"
                value={formData.artist_name}
                onChange={(e) => setFormData(prev => ({ ...prev, artist_name: e.target.value }))}
                placeholder="e.g., John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="album">Album Name</Label>
              <Input
                id="album"
                value={formData.album_name}
                onChange={(e) => setFormData(prev => ({ ...prev, album_name: e.target.value }))}
                placeholder="e.g., Sacred Songs Vol. 1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audio-type">Audio Type</Label>
              <Select 
                value={formData.audio_type} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, audio_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instrumental">Instrumental</SelectItem>
                  <SelectItem value="vocal">Vocal</SelectItem>
                  <SelectItem value="accompaniment">Accompaniment</SelectItem>
                  <SelectItem value="full">Full Track</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tempo">Tempo (BPM)</Label>
              <Input
                id="tempo"
                type="number"
                value={formData.tempo || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, tempo: e.target.value ? parseInt(e.target.value) : undefined }))}
                placeholder="e.g., 120"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="key">Key Signature</Label>
              <Input
                id="key"
                value={formData.key_signature}
                onChange={(e) => setFormData(prev => ({ ...prev, key_signature: e.target.value }))}
                placeholder="e.g., C Major"
              />
            </div>
          </div>

          {/* Public Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={formData.is_public}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
            />
            <Label htmlFor="public">Make this track public</Label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!isValid || uploading}>
              {uploading ? 'Uploading...' : 'Upload Track'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioUpload;
