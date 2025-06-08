import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

const HymnManager = () => {
  const [hymns, setHymns] = useState([]);
  const [hymnbooks, setHymnbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    titles: [''],
    bookId: '1'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hymnsResult, hymnbooksResult] = await Promise.all([
        supabase.from('HymnTitle').select('*').order('number'),
        supabase.from('HymnBook').select('id, name')
      ]);

      if (hymnsResult.error) throw hymnsResult.error;
      if (hymnbooksResult.error) throw hymnbooksResult.error;

      setHymns(hymnsResult.data || []);
      setHymnbooks(hymnbooksResult.data || []);
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

  const handleSave = async () => {
    try {
      const hymnData = {
        number: formData.number,
        titles: formData.titles.filter(title => title.trim()),
        bookId: parseInt(formData.bookId)
      };

      if (editingId) {
        const { error } = await supabase
          .from('HymnTitle')
          .update(hymnData)
          .eq('number', editingId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Hymn updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('HymnTitle')
          .insert([hymnData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Hymn created successfully.",
        });
      }

      setEditingId(null);
      setShowAddForm(false);
      setFormData({ number: '', titles: [''], bookId: '1' });
      fetchData();
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
    setEditingId(hymn.number);
    setFormData({
      number: hymn.number,
      titles: hymn.titles || [''],
      bookId: hymn.bookId.toString()
    });
    setShowAddForm(false);
  };

  const handleDelete = async (number) => {
    if (!confirm('Are you sure you want to delete this hymn?')) return;

    try {
      const { error } = await supabase
        .from('HymnTitle')
        .delete()
        .eq('number', number);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Hymn deleted successfully.",
      });
      
      fetchData();
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
    setFormData({ number: '', titles: [''], bookId: '1' });
  };

  const addTitleField = () => {
    setFormData({ ...formData, titles: [...formData.titles, ''] });
  };

  const updateTitle = (index, value) => {
    const newTitles = [...formData.titles];
    newTitles[index] = value;
    setFormData({ ...formData, titles: newTitles });
  };

  const removeTitle = (index) => {
    if (formData.titles.length > 1) {
      const newTitles = formData.titles.filter((_, i) => i !== index);
      setFormData({ ...formData, titles: newTitles });
    }
  };

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
          <h2 className="text-2xl font-bold text-slate-800">Hymn Management</h2>
          <Button onClick={() => setShowAddForm(true)} disabled={showAddForm || editingId}>
            <Plus className="w-4 h-4 mr-2" />
            Add Hymn
          </Button>
        </div>

        {(showAddForm || editingId) && (
          <Card className="p-4 mb-6 bg-blue-50">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Hymn' : 'Add New Hymn'}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="number">Hymn Number</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="e.g., 001, 002"
                />
              </div>
              <div>
                <Label htmlFor="bookId">Hymnbook</Label>
                <select
                  id="bookId"
                  value={formData.bookId}
                  onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {hymnbooks.map((book) => (
                    <option key={book.id} value={book.id.toString()}>
                      {book.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <Label>Titles</Label>
              {formData.titles.map((title, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={title}
                    onChange={(e) => updateTitle(index, e.target.value)}
                    placeholder="Hymn title"
                  />
                  {formData.titles.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeTitle(index)}
                      variant="outline"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={addTitleField}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Title
              </Button>
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
          {hymns.map((hymn) => (
            <Card key={hymn.number} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">#{hymn.number}</h3>
                  <div className="text-slate-600">
                    {hymn.titles && hymn.titles.map((title, index) => (
                      <div key={index}>{title}</div>
                    ))}
                  </div>
                  <div className="text-sm text-slate-500 mt-2">
                    Book ID: {hymn.bookId}
                  </div>
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
                    onClick={() => handleDelete(hymn.number)}
                    variant="outline"
                    size="sm"
                    disabled={editingId || showAddForm}
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

export default HymnManager;
