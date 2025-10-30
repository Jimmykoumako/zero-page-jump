import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, Book, Users, Music, Eye, ArrowLeft, Lock, Church, BookOpen, Sparkles, type LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface Hymnbook {
  id: number;
  name: string;
  description: string;
  category: string;
  is_active: boolean;
  access_level: string;
  added_hymns: number;
  card_color?: string | null; // Hex color code
  icon_name?: string | null;  // Name of lucide-react icon
}

interface HymnbookBrowserProps {
  onSelectHymnbook: (hymnbook: Hymnbook) => void;
  selectedHymnbook?: Hymnbook;
  onBack: () => void;
}

// Helper component to render Lucide icons dynamically
const DynamicLucideIcon = ({ name, ...props }: { name: string | null | undefined; [key: string]: any }) => {
  // Add more icons here as needed or implement a more dynamic loading strategy if the list grows very large
  const iconMap: { [key: string]: LucideIcon } = {
    Church,
    BookOpen,
    Music,
    Sparkles,
    Book, // Default icon
    // Add other icons you plan to use by their string name from lucide-react
  };

  const IconComponent = name && iconMap[name] ? iconMap[name] : Book; // Default to Book icon if not found
  return <IconComponent {...props} />;
};

const HymnbookBrowser = ({ onSelectHymnbook, selectedHymnbook, onBack }: HymnbookBrowserProps) => {
  const [hymnbooks, setHymnbooks] = useState<Hymnbook[]>([]);
  const [filteredHymnbooks, setFilteredHymnbooks] = useState<Hymnbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchHymnbooks();
  }, []);

  const fetchHymnbooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hymnbooks')
        .select('*')
        .order('name');

      if (error) throw error;

      // Map the database schema to our interface
      const mappedData: Hymnbook[] = (data || []).map(book => ({
        id: parseInt(book.id) || 0,
        name: book.name || '',
        description: book.description || '',
        category: 'General',
        is_active: true,
        access_level: 'public',
        added_hymns: 0,
        card_color: null,
        icon_name: null
      }));

      setHymnbooks(mappedData);
      setFilteredHymnbooks(mappedData);
    } catch (error) {
      console.error('Error fetching hymnbooks:', error);
      toast({
        title: "Error",
        description: "Failed to load hymnbooks.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterHymnbooks = () => {
    let results = hymnbooks;

    if (searchTerm) {
      results = results.filter(book =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterActive !== null) {
      results = results.filter(book => book.is_active === filterActive);
    }

    setFilteredHymnbooks(results);
  };

  useEffect(() => {
    filterHymnbooks();
  }, [searchTerm, filterActive, hymnbooks]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading hymnbooks...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h2 className="text-2xl font-bold text-slate-800">Hymnbook Browser</h2>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search hymnbooks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div>
            <label htmlFor="filter-hymnbook-status" className="block text-sm font-medium text-gray-700 mb-1">
              Show:
            </label>
            <select
              id="filter-hymnbook-status"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filterActive === null ? 'all' : filterActive ? 'active' : 'inactive'}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'all') setFilterActive(null);
                else setFilterActive(value === 'active');
              }}
            >
              <option value="all">All Hymnbooks</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Hymnbook List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHymnbooks.map((hymnbook) => {
            const isSelectable = hymnbook.is_active;
            const cardBaseStyle = "p-4 border-2 transition-all duration-200 ease-in-out flex flex-col h-full";
            const selectedStyle = selectedHymnbook?.id === hymnbook.id && isSelectable ? 'border-blue-500 shadow-md' : 'border-transparent';
            const hoverStyle = isSelectable ? 'hover:shadow-lg hover:border-blue-300 hover:bg-blue-50' : 'hover:shadow-md';
            const lockedStyle = !isSelectable ? 'opacity-60' : '';

            const handleCardClick = () => {
              if (isSelectable) {
                onSelectHymnbook(hymnbook);
              } else {
                toast({
                  title: "Access Restricted",
                  description: "This hymnbook requires a Pro subscription. Please upgrade to access.",
                  variant: "default", // Or 'info' if you have one
                });
              }
            };

            const iconContainerBg = hymnbook.card_color || '#e2e8f0'; // Default to a light gray if no color
            const iconColor = hymnbook.card_color ? 'text-white' : 'text-slate-700'; // Adjust based on contrast

            return (
              <TooltipProvider key={hymnbook.id} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card
                      className={`${cardBaseStyle} ${selectedStyle} ${hoverStyle} ${lockedStyle} ${isSelectable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      onClick={handleCardClick}
                      style={{ minHeight: '180px' }} // Ensure cards have a consistent minimum height
                    >
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div 
                            className="w-12 h-12 rounded-md flex items-center justify-center mr-3 shrink-0"
                            style={{ backgroundColor: iconContainerBg }}
                          >
                            <DynamicLucideIcon name={hymnbook.icon_name} className={`w-6 h-6 ${iconColor}`} />
                          </div>
                          <h3 className="text-lg font-semibold flex-grow">{hymnbook.name}</h3>
                          {hymnbook.is_active ? (
                            <span className="ml-2 text-xs py-0.5 px-1.5 rounded-full bg-green-100 text-green-700 font-medium whitespace-nowrap">Active</span>
                          ) : (
                            <span className="ml-2 text-xs py-0.5 px-1.5 rounded-full bg-yellow-100 text-yellow-700 font-medium whitespace-nowrap flex items-center">
                              <Lock className="w-3 h-3 mr-1" />
                              Locked
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mb-2 line-clamp-2">{hymnbook.description}</p>
                      </div>
                      <div className="text-xs text-slate-500 mt-auto pt-2 border-t border-slate-200">
                        Category: {hymnbook.category}
                      </div>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    {hymnbook.is_active ? (
                      <p>You have full access to this hymnbook.</p>
                    ) : (
                      <p>This hymnbook requires a Pro subscription. Click to learn more.</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        {filteredHymnbooks.length === 0 && (
          <div className="text-center py-4 text-slate-500">
            No hymnbooks found matching your criteria.
          </div>
        )}
      </Card>
    </div>
  );
};

export default HymnbookBrowser;
