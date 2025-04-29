import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { 
    Plus, 
    Edit, 
    Trash2, 
    Loader2, 
    SaveAll, 
    X, 
    Search, 
    FileText, 
    Cylinder, 
    AlertTriangle 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Define interfaces for type safety
interface Chemical {
    id: number;
    name: string;
    shelf_id: number;
    formula: string;
    formula_latex: string;
    synonyms: string[];
    location: string;
    msds_url: string | null;
    structure_2d_url: string | null;
    structure_3d_url: string | null;
    bottle_number: string;
    is_concentrated: boolean;
}

interface Shelf {
    id: number;
    name: string;
    location: string;
}

export default function ManageChemicals() {
    const [chemicals, setChemicals] = useState<Chemical[]>([]);
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingChemical, setEditingChemical] = useState<Chemical | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    
    const initialFormState = {
        name: "",
        shelf_id: "",
        formula: "",
        formula_latex: "",
        synonyms: "",
        location: "",
        msds_url: "",
        structure_2d_url: "",
        structure_3d_url: "",
        bottle_number: "",
        is_concentrated: false
    };
    
    const [formData, setFormData] = useState(initialFormState);
    
    const { user } = useAuth();
    const token = localStorage.getItem("token") || "dummy-token";
    const navigate = useNavigate();

    useEffect(() => {
        if (!user && !token) {
            navigate("/login");
            return;
        }
        fetchData();
    }, [user, token, navigate]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // HARDCODED DATA FOR NOW
            const mockChemicals: Chemical[] = [
                {
                    id: 1,
                    name: "Sodium Chloride",
                    shelf_id: 1,
                    formula: "NaCl",
                    formula_latex: "NaCl",
                    synonyms: ["Table Salt", "Halite"],
                    location: "Top shelf",
                    msds_url: "https://example.com/msds/nacl",
                    structure_2d_url: "https://example.com/2d/nacl",
                    structure_3d_url: null,
                    bottle_number: "B001",
                    is_concentrated: false
                },
                {
                    id: 2,
                    name: "Sulfuric Acid",
                    shelf_id: 2,
                    formula: "H2SO4",
                    formula_latex: "H_2SO_4",
                    synonyms: ["Oil of vitriol"],
                    location: "Bottom shelf",
                    msds_url: "https://example.com/msds/h2so4",
                    structure_2d_url: null,
                    structure_3d_url: null,
                    bottle_number: "B002",
                    is_concentrated: true
                },
                {
                    id: 3,
                    name: "Hydrochloric Acid",
                    shelf_id: 2,
                    formula: "HCl",
                    formula_latex: "HCl",
                    synonyms: ["Muriatic acid"],
                    location: "Middle shelf",
                    msds_url: "https://example.com/msds/hcl",
                    structure_2d_url: "https://example.com/2d/hcl",
                    structure_3d_url: null,
                    bottle_number: "B003",
                    is_concentrated: true
                },
                {
                    id: 4,
                    name: "Ethanol",
                    shelf_id: 3,
                    formula: "C2H5OH",
                    formula_latex: "C_2H_5OH",
                    synonyms: ["Ethyl alcohol", "Drinking alcohol"],
                    location: "Cabinet 2, top shelf",
                    msds_url: "https://example.com/msds/ethanol",
                    structure_2d_url: "https://example.com/2d/ethanol",
                    structure_3d_url: "https://example.com/3d/ethanol",
                    bottle_number: "B004",
                    is_concentrated: false
                }
            ];
            
            const mockShelves: Shelf[] = [
                { id: 1, name: "Main Shelf", location: "Room 101" },
                { id: 2, name: "Acids Cabinet", location: "Room 102" },
                { id: 3, name: "Flammables Cabinet", location: "Room 101" }
            ];
            
            setChemicals(mockChemicals);
            setShelves(mockShelves);
            
            /* Commented out actual API calls for now
            const [chemicalsResponse, shelvesResponse] = await Promise.all([
                fetch('/api/chemicals', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('/api/shelves', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);
            
            if (!chemicalsResponse.ok) throw new Error('Failed to fetch chemicals');
            if (!shelvesResponse.ok) throw new Error('Failed to fetch shelves');
            
            const chemicalsData = await chemicalsResponse.json();
            const shelvesData = await shelvesResponse.json();
            
            setChemicals(chemicalsData);
            setShelves(shelvesData);
            */
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleInputChange = (name: string, value: string | boolean) => {
        setFormData({ ...formData, [name]: value });
    };
    
    const handleSubmit = async () => {
        try {
            // Convert synonyms string to array
            const synonymsArray = formData.synonyms
                ? formData.synonyms.split(',').map(item => item.trim()).filter(item => item !== '')
                : [];
            
            // Prepare data for API
            const chemicalData = {
                ...formData,
                synonyms: synonymsArray,
                shelf_id: parseInt(formData.shelf_id, 10) || 1
            };
            
            setIsLoading(true);
            
            // HARDCODED BEHAVIOR FOR NOW
            if (editingChemical) {
                // Update existing chemical in mock data
                setChemicals(prevChemicals => 
                    prevChemicals.map(chem => 
                        chem.id === editingChemical.id 
                            ? { ...chem, ...chemicalData, id: editingChemical.id } 
                            : chem
                    )
                );
            } else {
                // Add new chemical to mock data
                const newId = Math.max(0, ...chemicals.map(c => c.id)) + 1;
                setChemicals(prevChemicals => [
                    ...prevChemicals, 
                    { ...chemicalData, id: newId, synonyms: synonymsArray } as Chemical
                ]);
            }
            
            /* Commented out actual API calls
            const url = editingChemical 
                    ? `/api/chemicals/${editingChemical.id}` 
                    : '/api/chemicals';
                    
            const method = editingChemical ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                    method,
                    headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(chemicalData)
            });
            
            if (!response.ok) {
                    throw new Error(editingChemical ? 'Failed to update chemical' : 'Failed to create chemical');
            }
            */
            
            // Reset form and state
            resetForm();
            setError(null);
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
            setShowAddForm(false);
        }
    };
    
    const handleEdit = (chemical: Chemical) => {
        // Convert array of synonyms back to comma-separated string
        const synonymsString = chemical.synonyms.join(", ");
        
        setFormData({
            name: chemical.name,
            shelf_id: chemical.shelf_id.toString(),
            formula: chemical.formula,
            formula_latex: chemical.formula_latex,
            synonyms: synonymsString,
            location: chemical.location,
            msds_url: chemical.msds_url || "",
            structure_2d_url: chemical.structure_2d_url || "",
            structure_3d_url: chemical.structure_3d_url || "",
            bottle_number: chemical.bottle_number,
            is_concentrated: chemical.is_concentrated
        });
        
        setEditingChemical(chemical);
        setShowAddForm(true);
    };
    
    const handleDelete = async (chemicalId: number) => {
        try {
            setIsLoading(true);
            
            // HARDCODED BEHAVIOR FOR NOW
            setChemicals(prevChemicals => prevChemicals.filter(chem => chem.id !== chemicalId));
            
            /* Commented out actual API call
            const response = await fetch(`/api/chemicals/${chemicalId}`, {
                    method: 'DELETE',
                    headers: {
                            'Authorization': `Bearer ${token}`
                    }
            });
            
            if (!response.ok) {
                    throw new Error('Failed to delete chemical');
            }
            */
            
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };
    
    const resetForm = () => {
        setFormData(initialFormState);
        setEditingChemical(null);
    };
    
    // Filter chemicals based on search and tab
    const filteredChemicals = chemicals.filter(chemical => {
        // Search filtering
        const searchMatch = 
            chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            chemical.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chemical.bottle_number.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Tab filtering
        if (activeTab === "all") return searchMatch;
        if (activeTab === "concentrated") return searchMatch && chemical.is_concentrated;
        if (activeTab === "regular") return searchMatch && !chemical.is_concentrated;
        
        return searchMatch;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Manage Chemicals</h1>
                    <Button onClick={() => {
                        setShowAddForm(!showAddForm);
                        if (!showAddForm) resetForm();
                    }}>
                        {!showAddForm ? (
                            <>
                                <Plus className="mr-2 h-4 w-4" /> Add New Chemical
                            </>
                        ) : (
                            <>
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </>
                        )}
                    </Button>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {showAddForm && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>
                                {editingChemical ? "Edit Chemical" : "Add New Chemical"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Chemical Name*</label>
                                    <Input
                                        placeholder="E.g., Sodium Chloride"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Shelf*</label>
                                    <Select
                                        value={formData.shelf_id}
                                        onValueChange={(value: string | boolean) => handleInputChange("shelf_id", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a shelf" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {shelves.map((shelf) => (
                                                <SelectItem key={shelf.id} value={shelf.id.toString()}>
                                                    {shelf.name} ({shelf.location})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Formula*</label>
                                    <Input
                                        placeholder="E.g., H2O"
                                        value={formData.formula}
                                        onChange={(e) => handleInputChange("formula", e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Formula LaTeX*</label>
                                    <Input
                                        placeholder="E.g., H_2O"
                                        value={formData.formula_latex}
                                        onChange={(e) => handleInputChange("formula_latex", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Bottle Number*</label>
                                    <Input
                                        placeholder="E.g., B001"
                                        value={formData.bottle_number}
                                        onChange={(e) => handleInputChange("bottle_number", e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Location within Shelf*</label>
                                    <Input
                                        placeholder="E.g., Top left corner"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange("location", e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Synonyms (comma separated)</label>
                                    <Input
                                        placeholder="E.g., water, aqua, dihydrogen monoxide"
                                        value={formData.synonyms}
                                        onChange={(e) => handleInputChange("synonyms", e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">MSDS URL</label>
                                    <Input
                                        type="url"
                                        placeholder="https://example.com/msds"
                                        value={formData.msds_url}
                                        onChange={(e) => handleInputChange("msds_url", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">2D Structure URL</label>
                                    <Input
                                        type="url"
                                        placeholder="https://example.com/structure_2d"
                                        value={formData.structure_2d_url}
                                        onChange={(e) => handleInputChange("structure_2d_url", e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">3D Structure URL</label>
                                    <Input
                                        type="url"
                                        placeholder="https://example.com/structure_3d"
                                        value={formData.structure_3d_url}
                                        onChange={(e) => handleInputChange("structure_3d_url", e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center space-x-2 mt-4">
                                    <Checkbox
                                        id="is_concentrated"
                                        checked={formData.is_concentrated}
                                        onCheckedChange={(checked: boolean) => 
                                            handleInputChange("is_concentrated", checked === true)
                                        }
                                    />
                                    <label
                                        htmlFor="is_concentrated"
                                        className="text-sm font-medium flex items-center"
                                    >
                                        <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                                        Is Concentrated
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6 flex space-x-2">
                                <Button onClick={handleSubmit} disabled={isLoading}>
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : editingChemical ? (
                                        <SaveAll className="mr-2 h-4 w-4" />
                                    ) : (
                                        <Plus className="mr-2 h-4 w-4" />
                                    )}
                                    {editingChemical ? "Update Chemical" : "Add Chemical"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Chemicals Inventory</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search chemicals..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            
                            <Tabs defaultValue="all" className="w-full sm:w-auto" value={activeTab} onValueChange={setActiveTab}>
                                <TabsList>
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="concentrated">Concentrated</TabsTrigger>
                                    <TabsTrigger value="regular">Regular</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading && chemicals.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filteredChemicals.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left text-xs font-semibold">Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold">Formula</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold">Shelf</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold">Bottle #</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredChemicals.map((chemical) => (
                                            <tr key={chemical.id} className="border-b">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{chemical.name}</div>
                                                    {chemical.synonyms.length > 0 && (
                                                        <div className="text-xs text-gray-500">
                                                            {chemical.synonyms.join(", ")}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap font-mono">
                                                    {chemical.formula}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {shelves.find(shelf => shelf.id === chemical.shelf_id)?.name || 'Unknown'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {chemical.bottle_number}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {chemical.is_concentrated ? (
                                                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                                            Concentrated
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                            Regular
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex space-x-2">
                                                        {chemical.msds_url && (
                                                            <Button variant="outline" size="sm" asChild>
                                                                <a href={chemical.msds_url} target="_blank" rel="noopener noreferrer">
                                                                    <FileText className="h-3 w-3 mr-1" />
                                                                    MSDS
                                                                </a>
                                                            </Button>
                                                        )}
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleEdit(chemical)}
                                                        >
                                                            <Edit className="h-3 w-3 mr-1" />
                                                            Edit
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleDelete(chemical.id)}
                                                        >
                                                            <Trash2 className="h-3 w-3 mr-1 text-red-500" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Cylinder className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                <p>No chemicals found matching your criteria</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}