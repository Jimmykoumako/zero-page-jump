
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TrackManagerSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const TrackManagerSearch = ({ searchQuery, onSearchChange }: TrackManagerSearchProps) => {
  return (
    <div className="container mx-auto px-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tracks, artists, or albums..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default TrackManagerSearch;
