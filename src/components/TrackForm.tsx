
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Upload, Save, X } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  url: string;
  duration: number;
  artist_name?: string;
  album_name?: string;
  release_date?: string;
  track_number?: number;
  disc_number?: number;
  explicit?: boolean;
  cover_image_url?: string;
  hymnTitleNumber?: string;
  bookId?: number;
}

interface TrackFormProps {
  track?: Track | null;
  isEditing: boolean;
  onSubmit: (trackData: Partial<Track>) => void;
  onCancel: () => void;
}

const TrackForm = ({ track, isEditing, onSubmit, onCancel }: TrackFormProps) => {
  const [formData, setFormData] = useState({
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
      });
    }
  }, [track]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: Partial<Track> = {
      ...formData,
      id: isEditing ? track?.id : `track_${Date.now()}`,
    };

    // Remove empty strings for optional fields
    Object.keys(submitData).forEach(key => {
      if (typeof submitData[key as keyof Track] === 'string' && submitData[key as keyof Track] === '') {
        delete submitData[key as keyof Track];
      }
    });

    onSubmit(submitData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

              <div>
                <Label htmlFor="url">Audio URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="https://example.com/audio.mp3"
                  required
                />
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

              <div>
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  type="url"
                  value={formData.cover_image_url}
                  onChange={(e) => handleInputChange('cover_image_url', e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                />
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
