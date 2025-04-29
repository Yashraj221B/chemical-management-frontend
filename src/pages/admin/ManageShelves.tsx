// src/pages/admin/ManageShelves.tsx
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, SaveAll, X, MapPin, Book } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

// Define shelf type to match backend
interface Shelf {
  id?: number;
  name: string;
  location: string;
  capacity?: number;
  itemCount?: number;
  lastUpdated?: string;
}

export default function ManageShelves() {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingShelf, setEditingShelf] = useState<Shelf | null>(null);
  const [newShelf, setNewShelf] = useState<Shelf>({ name: "", location: "" });
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchShelves();
  }, []);

  const fetchShelves = async () => {
    setIsLoading(true);
    try {
      // For demo:
      const demoShelves: Shelf[] = [
        { id: 1, name: "Shelf A", location: "Laboratory Room 101", capacity: 50, itemCount: 32, lastUpdated: "2023-11-15" },
        { id: 2, name: "Shelf B", location: "Laboratory Room 101", capacity: 35, itemCount: 18, lastUpdated: "2023-11-20" },
        { id: 3, name: "Concentrated Chemicals Shelf", location: "Secured Storage Room", capacity: 25, itemCount: 25, lastUpdated: "2023-11-22" },
        { id: 4, name: "Shelf C", location: "Laboratory Room 102", capacity: 40, itemCount: 12, lastUpdated: "2023-11-18" },
        { id: 5, name: "Fume Hood", location: "Laboratory Room 101", capacity: 15, itemCount: 8, lastUpdated: "2023-11-21" },
        { id: 6, name: "Shelf D", location: "Storage Room", capacity: 60, itemCount: 45, lastUpdated: "2023-11-19" },
        { id: 7, name: "Shelf E", location: "Laboratory Room 103", capacity: 30, itemCount: 7, lastUpdated: "2023-11-17" },
      ];
      setShelves(demoShelves);
    } catch (err) {
      setError("Failed to fetch shelves");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddShelf = async () => {
    if (!newShelf.name || !newShelf.location) {
      setError("Name and location are required");
      return;
    }

    setIsLoading(true);
    try {
      // For demo:
      const demoNewShelf = { 
        ...newShelf, 
        id: shelves.length + 1,
        capacity: 50,
        itemCount: 0,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setShelves([...shelves, demoNewShelf]);
      setNewShelf({ name: "", location: "" });
      setShowAddForm(false);
      setError("");
    } catch (err) {
      setError("Failed to add shelf");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (shelf: Shelf) => {
    setEditingShelf(shelf);
  };

  const handleCancelEdit = () => {
    setEditingShelf(null);
  };

  const handleUpdateShelf = async () => {
    if (!editingShelf || !editingShelf.name || !editingShelf.location) {
      setError("Name and location are required");
      return;
    }

    setIsLoading(true);
    try {
      const updatedShelf = {
        ...editingShelf,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      const updatedShelves = shelves.map((shelf) =>
        shelf.id === updatedShelf.id ? updatedShelf : shelf
      );
      setShelves(updatedShelves);
      setEditingShelf(null);
      setError("");
    } catch (err) {
      setError("Failed to update shelf");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteShelf = async (shelfId: number | undefined) => {
    if (!shelfId) return;

    setIsLoading(true);
    try {
      const updatedShelves = shelves.filter((shelf) => shelf.id !== shelfId);
      setShelves(updatedShelves);
      setDeleteError(null);
    } catch (err) {
      setDeleteError("Failed to delete shelf");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate usage percentage for progress bar
  const getUsagePercentage = (used?: number, total?: number) => {
    if (!used || !total) return 0;
    return Math.min(100, (used / total) * 100);
  };

  // Determine status color based on usage
  const getStatusColor = (used?: number, total?: number) => {
    if (!used || !total) return "bg-gray-200";
    const percentage = (used / total) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Shelves</h1>
            <p className="text-slate-500 mt-1">Add, edit or remove storage shelves from the system</p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={isLoading}
            className="w-full sm:w-auto"
            size="lg"
          >
            {!showAddForm ? (
              <>
                <Plus className="mr-2 h-5 w-5" /> Add New Shelf
              </>
            ) : (
              <>
                <X className="mr-2 h-5 w-5" /> Cancel
              </>
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {deleteError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        )}

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-8 border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Add New Shelf</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="shelfName" className="text-sm font-medium">Shelf Name</label>
                        <Input
                          id="shelfName"
                          placeholder="Enter shelf name"
                          value={newShelf.name}
                          onChange={(e) => setNewShelf({ ...newShelf, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="shelfLocation" className="text-sm font-medium">Location</label>
                        <Input
                          id="shelfLocation"
                          placeholder="Enter shelf location"
                          value={newShelf.location}
                          onChange={(e) => setNewShelf({ ...newShelf, location: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddShelf} disabled={isLoading} size="lg" className="w-full md:w-auto">
                      {isLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-5 w-5" />
                      )}
                      Create Shelf
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading && !shelves.length ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shelves.map((shelf) => (
              <Card key={shelf.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {editingShelf && editingShelf.id === shelf.id ? (
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Shelf Name</label>
                      <Input
                        placeholder="Shelf Name"
                        value={editingShelf.name}
                        onChange={(e) => setEditingShelf({...editingShelf, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        placeholder="Location"
                        value={editingShelf.location}
                        onChange={(e) => setEditingShelf({...editingShelf, location: e.target.value})}
                      />
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button onClick={handleUpdateShelf} disabled={isLoading} className="flex-1">
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <SaveAll className="mr-2 h-4 w-4" />
                        )}
                        Save
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-bold">{shelf.name}</CardTitle>
                        <Badge variant={shelf.itemCount === shelf.capacity ? "destructive" : "outline"}>
                          {shelf.itemCount === shelf.capacity ? "Full" : "Active"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-2 text-slate-600 mb-3">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{shelf.location}</span>
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Storage Capacity</span>
                            <span className="font-medium">{shelf.itemCount} / {shelf.capacity}</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getStatusColor(shelf.itemCount, shelf.capacity)}`} 
                              style={{ width: `${getUsagePercentage(shelf.itemCount, shelf.capacity)}%` }}
                            >
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Book className="h-3.5 w-3.5" />
                            <span>Last updated:</span>
                          </div>
                          <span>{shelf.lastUpdated}</span>
                        </div>
                      </div>
                    </CardContent>
                    <Separator />
                    <CardFooter className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(shelf)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteShelf(shelf.id)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Delete
                      </Button>
                    </CardFooter>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}

        {!isLoading && shelves.length === 0 && (
          <div className="text-center p-12 bg-white rounded-lg border border-dashed">
            <h3 className="text-lg font-medium text-slate-600 mb-2">No shelves found</h3>
            <p className="text-slate-500 mb-4">
              Get started by adding your first storage shelf
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Shelf
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
