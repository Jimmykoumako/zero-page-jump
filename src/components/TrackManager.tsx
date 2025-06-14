
import { useState } from 'react';
import TrackManagerHeader from './track-manager/TrackManagerHeader';
import TrackManagerSearch from './track-manager/TrackManagerSearch';
import TrackManagerStats from './track-manager/TrackManagerStats';
import TrackGrid from './track-manager/TrackGrid';
import TrackManagerLoading from './track-manager/TrackManagerLoading';
import TrackForm from './TrackForm';
import { useTrackManager } from '@/hooks/useTrackManager';
import type { Track } from '@/types/track';

const TrackManager = () => {
  const { tracks, loading, createTrack, updateTrack, deleteTrack } = useTrackManager();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.album_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateForm = () => {
    setSelectedTrack(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const openEditForm = (track: Track) => {
    setSelectedTrack(track);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (trackData: any) => {
    if (isEditing && selectedTrack) {
      await updateTrack(selectedTrack.id, trackData);
    } else {
      await createTrack(trackData);
    }
    setIsFormOpen(false);
    setSelectedTrack(null);
    setIsEditing(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedTrack(null);
    setIsEditing(false);
  };

  if (loading) {
    return <TrackManagerLoading />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TrackManagerHeader onCreateTrack={openCreateForm} />
      <TrackManagerSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <TrackManagerStats tracks={tracks} />
      <TrackGrid
        tracks={filteredTracks}
        searchQuery={searchQuery}
        onEditTrack={openEditForm}
        onDeleteTrack={deleteTrack}
        onCreateTrack={openCreateForm}
      />

      {isFormOpen && (
        <TrackForm
          track={selectedTrack}
          isEditing={isEditing}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default TrackManager;
