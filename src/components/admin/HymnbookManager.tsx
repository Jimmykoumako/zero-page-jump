
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

const HymnbookManager = () => {
  const [hymnbooks, setHymnbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    accessLevel: 'PRIVATE'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchHymnbooks();
  }, []);

  const fetchHymnbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('HymnBook')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHymnbooks(data || []);
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

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from('HymnBook')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Hymnbook updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('HymnBook')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Hymnbook created successfully.",
        });
      }

      setEditingId(null);
      setShowAddForm(false);
      setFormData({ name: '', description: '', category: '', accessLevel: 'PRIVATE' });
      fetchHymnbooks();
    } catch (error) {
      console.error('Error saving hymnbook:', error);
      toast({
        title: "Error",
        description: "Failed to save hymnbook.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (hymnbook) => {
    setEditingId(hymnbook.id);
    setFormData({
      name: hymnbook.name,
      description: hymnbook.description,
      category: hymnbook.category,
      accessLevel: hymnbook.accessLevel
    });
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this hymnbook?')) return;

    try {
      const { error } = await supabase
        .from('HymnBook')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Hymnbook deleted successfully.",
      });
      
      fetchHymnbooks();
    } catch (error) {
      console.error('Error deleting hymnbook:', error);
      toast({
        title: "Error",
        description: "Failed to delete hymnbook.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ name: '', description: '', category: '', accessLevel: 'PRIVATE' });
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading hymnbooks...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Hymnbook Management</h2>
          <Button onClick={() => setShowAddForm(true)} disabled={showAddForm || editingId}>
            <Plus className="w-4 h-4 mr-2" />
            Add Hymnbook
          </Button>
        </div>

        {(showAddForm || editingId) && (
          <Card className="p-4 mb-6 bg-blue-50">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Hymnbook' : 'Add New Hymnbook'}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Hymnbook name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Traditional, Contemporary"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Hymnbook description"
                />
              </div>
              <div>
                <Label htmlFor="accessLevel">Access Level</Label>
                <select
                  id="accessLevel"
                  value={formData.accessLevel}
                  onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="PRIVATE">Private</option>
                  <option value="PUBLIC">Public</option>
                </select>
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
          {hymnbooks.map((hymnbook) => (
            <Card key={hymnbook.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{hymnbook.name}</h3>
                  <p className="text-slate-600">{hymnbook.description}</p>
                  <div className="flex gap-4 text-sm text-slate-500 mt-2">
                    <span>Category: {hymnbook.category}</span>
                    <span>Access: {hymnbook.accessLevel}</span>
                    <span>Hymns: {hymnbook.addedHymns}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(hymnbook)}
                    variant="outline"
                    size="sm"
                    disabled={editingId || showAddForm}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(hymnbook.id)}
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

export default HymnbookManager;
