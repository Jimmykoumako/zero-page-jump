
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Save, X } from 'lucide-react';
import AudioUpload from '@/components/ui/audio-upload';
import ImageUpload from '@/components/ui/image-upload';
import type { Track, TrackFormData } from '@/types/track';

interface TrackFormProps {
  track?: Track | null;
  isEditing: boolean;
  onSubmit: (trackData: TrackFormData) => void;
  onCancel: () => void;
}

const TrackForm = ({ track, isEditing, onSubmit, onCancel }: TrackFormProps) => {
  const [formData, setFormData] = useState<TrackFormData>({
    title: '',
    url: '',
    duration: 0,
    artist_name: '',
    album_name: '',
    release_date: '',
    track_number: 1,
    disc_number: 1,
    explicit: false,
    cover_image_url: '',
    hymnTitleNumber: '',
    bookId: 1,
    bucket_name: 'audio_files',
    image_bucket_name: 'album-covers',
  });

  useEffect(() => {
    if (track) {
      setFormData({
        title: track.title || '',
        url: track.url || '',
        duration: track.duration || 0,
        artist_name: track.artist_name || '',
        album_name: track.album_name || '',
        release_date: track.release_date || '',
        track_number: track.track_number || 1,
        disc_number: track.disc_number || 1,
        explicit: track.explicit || false,
        cover_image_url: track.cover_image_url || '',
        hymnTitleNumber: track.hymnTitleNumber || '',
        bookId: track.bookId || 1,
        bucket_name: track.bucket_name || 'audio_files',
        image_bucket_name: track.image_bucket_name || 'album-covers',
      });
    }
  }, [track]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure required fields are provided
    if (!formData.title || !formData.url || !formData.duration) {
      return;
    }

    onSubmit(formData);
  };

  const handleInputChange = (field: keyof TrackFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAudioUpload = (fileName: string, originalName: string) => {
    setFormData(prev => ({
      ...prev,
      url: fileName
    }));
  };

  const handleImageUpload = (fileName: string, originalName: string) => {
    setFormData(prev => ({
      ...prev,
      cover_image_url: fileName
    }));
  };

  // Generate preview URLs for uploaded files
  const getAudioPreviewUrl = () => {
    if (formData.url && formData.bucket_name) {
      return `https://sqnvnolccwghpqrcezwf.supabase.co/storage/v1/object/public/${formData.bucket_name}/${formData.url}`;
    }
    return '';
  };

  const getImagePreviewUrl = () => {
    if (formData.cover_image_url && formData.image_bucket_name) {
      return `https://sqnvnolccwghpqrcezwf.supabase.co/storage/v1/object/public/${formData.image_bucket_name}/${formData.cover_image_url}`;
    }
    return '';
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            {isEditing ? 'Edit Track' : 'Create New Track'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Track Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter track title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="artist">Artist Name</Label>
                  <Input
                    id="artist"
                    value={formData.artist_name}
                    onChange={(e) => handleInputChange('artist_name', e.target.value)}
                    placeholder="Enter artist name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="album">Album Name</Label>
                  <Input
                    id="album"
                    value={formData.album_name}
                    onChange={(e) => handleInputChange('album_name', e.target.value)}
                    placeholder="Enter album name"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (seconds) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                    placeholder="180"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Uploads */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">File Uploads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AudioUpload
                  bucketName={formData.bucket_name || 'audio_files'}
                  onUploadComplete={handleAudioUpload}
                  label="Audio File *"
                  currentAudioUrl={getAudioPreviewUrl()}
                  maxFileSizeMB={50}
                />
                
                <ImageUpload
                  bucketName={formData.image_bucket_name || 'album-covers'}
                  onUploadComplete={handleImageUpload}
                  label="Cover Image"
                  currentImageUrl={getImagePreviewUrl()}
                  maxFileSizeMB={5}
                />
              </div>

              {/* Storage bucket configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label htmlFor="bucketName">Audio Bucket Name</Label>
                  <Input
                    id="bucketName"
                    value={formData.bucket_name}
                    onChange={(e) => handleInputChange('bucket_name', e.target.value)}
                    placeholder="audio_files"
                  />
                </div>
                <div>
                  <Label htmlFor="imageBucketName">Cover Image Bucket Name</Label>
                  <Input
                    id="imageBucketName"
                    value={formData.image_bucket_name}
                    onChange={(e) => handleInputChange('image_bucket_name', e.target.value)}
                    placeholder="album-covers"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Track Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Track Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="trackNumber">Track Number</Label>
                  <Input
                    id="trackNumber"
                    type="number"
                    min="1"
                    value={formData.track_number}
                    onChange={(e) => handleInputChange('track_number', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <Label htmlFor="discNumber">Disc Number</Label>
                  <Input
                    id="discNumber"
                    type="number"
                    min="1"
                    value={formData.disc_number}
                    onChange={(e) => handleInputChange('disc_number', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <Label htmlFor="releaseDate">Release Date</Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => handleInputChange('release_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="explicit"
                  checked={formData.explicit}
                  onCheckedChange={(checked) => handleInputChange('explicit', checked)}
                />
                <Label htmlFor="explicit">Explicit Content</Label>
              </div>
            </CardContent>
          </Card>

          {/* Hymn Information (Optional) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hymn Information (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hymnNumber">Hymn Number</Label>
                  <Input
                    id="hymnNumber"
                    value={formData.hymnTitleNumber}
                    onChange={(e) => handleInputChange('hymnTitleNumber', e.target.value)}
                    placeholder="e.g., 123"
                  />
                </div>
                <div>
                  <Label htmlFor="bookId">Book ID</Label>
                  <Input
                    id="bookId"
                    type="number"
                    min="1"
                    value={formData.bookId}
                    onChange={(e) => handleInputChange('bookId', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Update Track' : 'Create Track'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrackForm;
