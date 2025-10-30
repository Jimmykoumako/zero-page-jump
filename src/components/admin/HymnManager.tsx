import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, Save, X, Search, Music } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const HymnManager = () => {
  const [hymns, setHymns] = useState([]);
  const [hymnbooks, setHymnbooks] = useState([]);
  const [selectedHymnbook, setSelectedHymnbook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    title: '',
    author: '',
    composer: '',
    lyrics_plain: '',
    hymnbook_id: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedHymnbook) {
      fetchHymns();
    }
  }, [selectedHymnbook]);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('hymnbooks')
        .select('id, name, description');

      if (error) throw error;

      setHymnbooks(data || []);
      
      if (data && data.length > 0) {
        setSelectedHymnbook(data[0]);
      }
    } catch (error) {
      console.error('Error fetching hymnbooks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hymnbooks.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHymns = async () => {
    if (!selectedHymnbook) return;

    try {
      const { data, error } = await supabase
        .from('hymns')
        .select('*')
        .eq('hymnbook_id', selectedHymnbook.id)
        .order('number');

      if (error) throw error;
      setHymns(data || []);
    } catch (error) {
      console.error('Error fetching hymns:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hymns.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      const hymnData = {
        number: parseInt(formData.number),
        title: formData.title,
        author: formData.author,
        composer: formData.composer,
        lyrics_plain: formData.lyrics_plain,
        lyrics_lrc: formData.lyrics_plain, // For now, use same as plain
        hymnbook_id: selectedHymnbook?.id
      };

      if (editingId) {
        const { error } = await supabase
          .from('hymns')
          .update(hymnData)
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Hymn updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('hymns')
          .insert([hymnData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Hymn created successfully.",
        });
      }

      setEditingId(null);
      setShowAddForm(false);
      setFormData({ number: '', title: '', author: '', composer: '', lyrics_plain: '', hymnbook_id: '' });
      fetchHymns();
    } catch (error) {
      console.error('Error saving hymn:', error);
      toast({
        title: "Error",
        description: "Failed to save hymn.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (hymn) => {
    setEditingId(hymn.id);
    setFormData({
      number: hymn.number?.toString() || '',
      title: hymn.title || '',
      author: hymn.author || '',
      composer: hymn.composer || '',
      lyrics_plain: hymn.lyrics_plain || '',
      hymnbook_id: hymn.hymnbook_id
    });
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this hymn?')) return;

    try {
      const { error } = await supabase
        .from('hymns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Hymn deleted successfully.",
      });
      
      fetchHymns();
    } catch (error) {
      console.error('Error deleting hymn:', error);
      toast({
        title: "Error",
        description: "Failed to delete hymn.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ number: '', title: '', author: '', composer: '', lyrics_plain: '', hymnbook_id: '' });
  };

  const filteredHymns = hymns.filter(hymn =>
    hymn.number?.toString().includes(searchTerm) ||
    hymn.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading hymns...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Hymn Management</h2>
          <Button onClick={() => setShowAddForm(true)} disabled={showAddForm || editingId}>
            <Plus className="w-4 h-4 mr-2" />
            Add Hymn
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Select Hymnbook</Label>
            <Select
              value={selectedHymnbook?.id || ""}
              onValueChange={(value) => {
                const book = hymnbooks.find(b => b.id === value);
                setSelectedHymnbook(book);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a hymnbook" />
              </SelectTrigger>
              <SelectContent>
                {hymnbooks.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Search Hymns</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by number or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {(showAddForm || editingId) && (
          <Card className="p-4 mb-6 bg-muted">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Hymn' : 'Add New Hymn'}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Hymn Number</Label>
                <Input
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="e.g., 1, 2, 3"
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Hymn title"
                />
              </div>
              <div>
                <Label>Author</Label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
              <div>
                <Label>Composer</Label>
                <Input
                  value={formData.composer}
                  onChange={(e) => setFormData({ ...formData, composer: e.target.value })}
                  placeholder="Composer name"
                />
              </div>
              <div className="col-span-2">
                <Label>Lyrics</Label>
                <Textarea
                  value={formData.lyrics_plain}
                  onChange={(e) => setFormData({ ...formData, lyrics_plain: e.target.value })}
                  placeholder="Enter hymn lyrics..."
                  rows={6}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {filteredHymns.length === 0 ? (
            <div className="text-center py-8">
              {selectedHymnbook ? 'No hymns found' : 'Please select a hymnbook'}
            </div>
          ) : (
            filteredHymns.map((hymn) => (
              <Card key={hymn.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">#{hymn.number} - {hymn.title}</h3>
                    {hymn.author && <p className="text-sm">Author: {hymn.author}</p>}
                    {hymn.composer && <p className="text-sm">Composer: {hymn.composer}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(hymn)}
                      variant="outline"
                      size="sm"
                      disabled={editingId || showAddForm}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(hymn.id)}
                      variant="outline"
                      size="sm"
                      disabled={editingId || showAddForm}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default HymnManager;
