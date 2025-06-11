
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, SortAsc, Grid, List } from 'lucide-react';
import { Music } from 'lucide-react';

interface AudioBrowserHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'recent' | 'title' | 'artist';
  setSortBy: (sort: 'recent' | 'title' | 'artist') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  filteredTrackCount: number;
}

const AudioBrowserHeader = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  filteredTrackCount
}: AudioBrowserHeaderProps) => {
  const handleSortToggle = () => {
    setSortBy(sortBy === 'recent' ? 'title' : sortBy === 'title' ? 'artist' : 'recent');
  };

  const handleViewToggle = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  return (
    <div className="relative overflow-hidden border-b bg-gradient-to-r from-primary/5 via-background to-accent/5 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-xl p-4 shadow-lg">
                <Music className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Music Library
              </h1>
              <p className="text-muted-foreground">Discover and enjoy hymns and worship music</p>
            </div>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search hymns, artists, or numbers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-12 bg-background/80 backdrop-blur border-2 transition-all duration-200 focus:border-primary/50 focus:bg-background"
                />
                {searchQuery && (
                  <Badge variant="secondary" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {filteredTrackCount} results
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSortToggle}
                  className="flex items-center gap-2"
                >
                  <SortAsc className="w-4 h-4" />
                  Sort: {sortBy === 'recent' ? 'Recent' : sortBy === 'title' ? 'Title' : 'Artist'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewToggle}
                  className="flex items-center gap-2"
                >
                  {viewMode === 'list' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                  {viewMode === 'list' ? 'Grid View' : 'List View'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioBrowserHeader;
