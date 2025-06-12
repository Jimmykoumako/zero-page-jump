
// Mock audio files for testing
export const mockAudioFiles = [
  {
    id: 'mock-1',
    title: 'Amazing Grace - Traditional',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 180,
    artist: 'Traditional Hymn'
  },
  {
    id: 'mock-2',
    title: 'How Great Thou Art - Orchestral',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 240,
    artist: 'Orchestral Version'
  },
  {
    id: 'mock-3',
    title: 'Be Thou My Vision - Acoustic',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 200,
    artist: 'Acoustic Guitar'
  }
];

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
