import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  SaveAll,
  Search,
  FileText,
  Cylinder,
  ChevronsUpDown,
  Microscope,
  Download,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ChemicalStructureViewer from "@/components/ChemicalModal";
import { formatFormulaLatex } from "@/lib/utils";

// Define the API base URL
const API_BASE_URL = "https://chemical-management-backend.azurewebsites.net/chemicals/";
const PUBCHEM_API_URL = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";

// Define interfaces for type safety
interface Chemical {
  name: string;
  shelf_id: string;
  formula: string;
  formula_latex: string;
  synonyms: string[];
  msds_url: string;
  structure_2d_url: string;
  bottle_number: string;
  is_concentrated: boolean;
  shelf: {
    name: string;
    location: string;
    shelfInitial: string;
    id: string;
  };
  id: string;
}

interface Shelf {
  id: string;
  name: string;
  location: string;
  shelfInitial: string;
}

interface PubChemResult {
  name?: string;
  formula?: string;
  synonyms?: string[];
  structure_url?: string;
}

function formatFormula(formula: string) {
  return formula.split("").map((char, index) => {
    if (!isNaN(Number(char))) {
      return (
        <sub key={index} className="text-xs">
          {char}
        </sub>
      );
    }
    if (char === "+") {
      return (
        <sup key={index} className="text-xs">
          {char}
        </sup>
      );
    }
    return char;
  });
}

export default function ManageChemicals() {
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChemical, setEditingChemical] = useState<Chemical | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [actionInProgress, setActionInProgress] = useState(false);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);
  const [nextBottleNumber, setNextBottleNumber] = useState<string>("");
  const [isPubChemLoading, setIsPubChemLoading] = useState(false);
  const [pubChemError, setPubChemError] = useState<string | null>(null);

  const initialFormState = {
    name: "",
    shelf_id: "",
    formula: "",
    formula_latex: "",
    synonyms: "",
    msds_url: "",
    structure_2d_url: "",
    bottle_number: "",
    is_concentrated: false,
  };

  const [formData, setFormData] = useState(initialFormState);

  const { user } = useAuth();
  const token = localStorage.getItem("token") || "";
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
      const [chemicalsResponse, shelvesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/shelves/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!chemicalsResponse.ok) throw new Error("Failed to fetch chemicals");
      if (!shelvesResponse.ok) throw new Error("Failed to fetch shelves");

      const chemicalsData = await chemicalsResponse.json();
      const shelvesData = await shelvesResponse.json();

      setChemicals(chemicalsData);
      setShelves(shelvesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch next available bottle number when shelf changes
  useEffect(() => {
    if (formData.shelf_id) {
      fetchNextBottleNumber(formData.shelf_id);
    }
  }, [formData.shelf_id]);

  // Auto-convert formula to LaTeX whenever formula changes
  useEffect(() => {
    if (formData.formula && !formData.formula_latex) {
      const latex = formatFormulaLatex(formData.formula);
      setFormData((prev) => ({ ...prev, formula_latex: latex }));
    }
  }, [formData.formula]);

  const fetchNextBottleNumber = async (shelfId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/next-bottle-number?shelf_id=${shelfId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch next bottle number");

      const data = await response.json();
      setNextBottleNumber(data.next_bottle_number);
      // Auto-set the bottle number in the form
      setFormData((prev) => ({ ...prev, bottle_number: data.next_bottle_number }));
    } catch (err) {
      console.error("Error fetching next bottle number:", err);
    }
  };

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData({ ...formData, [name]: value });
  };

  const fetchFromPubChem = async (query: string) => {
    setIsPubChemLoading(true);
    setPubChemError(null);
    
    try {
      // Try direct match by name first
      const nameSearchUrl = `${PUBCHEM_API_URL}/compound/name/${encodeURIComponent(query)}/cids/JSON`;
      const response = await fetch(nameSearchUrl);
      
      if (response.ok) {
        const data = await response.json();
        if (data.IdentifierList && data.IdentifierList.CID && data.IdentifierList.CID.length > 0) {
          const cid = data.IdentifierList.CID[0];
          return await getCompoundDataByCID(cid, query);
        }
      }
      
      // If direct match fails, try autocomplete suggestions
      const autocompleteUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/${encodeURIComponent(query)}/json`;
      const autocompleteResponse = await fetch(autocompleteUrl);
      
      if (!autocompleteResponse.ok) {
        throw new Error("PubChem search failed");
      }
      
      const autocompleteData = await autocompleteResponse.json();
      
      if (!autocompleteData.dictionary_terms || !autocompleteData.dictionary_terms.compound || autocompleteData.dictionary_terms.compound.length === 0) {
        throw new Error("No suggestions found for this chemical");
      }
      
      // Try each suggestion in order (limit to first 5)
      const suggestions = autocompleteData.dictionary_terms.compound.slice(0, 5);
      
      for (const suggestion of suggestions) {
        const suggestionUrl = `${PUBCHEM_API_URL}/compound/name/${encodeURIComponent(suggestion)}/cids/JSON`;
        const suggestionResponse = await fetch(suggestionUrl);
        
        if (suggestionResponse.ok) {
          const data = await suggestionResponse.json();
          if (data.IdentifierList && data.IdentifierList.CID && data.IdentifierList.CID.length > 0) {
            const cid = data.IdentifierList.CID[0];
            return await getCompoundDataByCID(cid, suggestion);
          }
        }
      }
      
      // If we get here, no matches were found
      throw new Error("No matches found in PubChem");
    } catch (err) {
      setPubChemError(err instanceof Error ? err.message : "Failed to fetch data from PubChem");
      return null;
    } finally {
      setIsPubChemLoading(false);
    }
  };
  
  // Helper function to get compound data once we have a CID
  const getCompoundDataByCID = async (cid: number, matchedName: string): Promise<PubChemResult | null> => {
    try {
      // Get properties
      const propsUrl = `${PUBCHEM_API_URL}/compound/cid/${cid}/property/MolecularFormula,IUPACName,Synonyms/JSON`;
      const propsResponse = await fetch(propsUrl);
      
      if (!propsResponse.ok) {
        throw new Error("Failed to fetch compound properties");
      }
      
      const propsData = await propsResponse.json();
      const properties = propsData.PropertyTable.Properties[0];
      
      // Get structure URL
      const structureUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG`;
      
      return {
        name: properties.IUPACName || matchedName,
        formula: properties.MolecularFormula || "",
        synonyms: properties.Synonyms ? properties.Synonyms.slice(0, 10) : [],
        structure_url: structureUrl,
      };
    } catch (err) {
      console.error("Error processing PubChem data:", err);
      return null;
    }
  };  
  
  const populateFromPubChem = async () => {
    const query = formData.name || formData.formula;
    if (!query) {
      setPubChemError("Please enter a chemical name or formula to search");
      return;
    }
    
    const result = await fetchFromPubChem(query);
    
    if (result) {
      setFormData((prev) => ({
        ...prev,
        name: result.name || prev.name,
        formula: result.formula || prev.formula,
        formula_latex: result.formula ? formatFormulaLatex(result.formula) : prev.formula_latex,
        synonyms: result.synonyms ? result.synonyms.join(", ") : prev.synonyms,
        structure_2d_url: result.structure_url || prev.structure_2d_url,
      }));
    }
  };

  const validateBottleNumber = async (bottleNumber: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/validate-bottle/${bottleNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to validate bottle number");

      const data = await response.json();
      return data.available;
    } catch (err) {
      console.error("Error validating bottle number:", err);
      return false;
    }
  };

  const handleSubmit = async () => {
    try {
      // Convert synonyms string to array
      const synonymsArray = formData.synonyms
        ? formData.synonyms
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "")
        : [];

      // Validate bottle number if creating new chemical
      if (!editingChemical) {
        const isAvailable = await validateBottleNumber(formData.bottle_number);
        if (!isAvailable) {
          setError("This bottle number is already in use. Please use another.");
          return;
        }
      }

      // Prepare data for API
      const chemicalData = {
        name: formData.name,
        shelf_id: formData.shelf_id,
        formula: formData.formula,
        formula_latex: formData.formula_latex,
        synonyms: synonymsArray,
        msds_url: formData.msds_url,
        structure_2d_url: formData.structure_2d_url,
        bottle_number: formData.bottle_number,
        is_concentrated: formData.is_concentrated,
      };

      setActionInProgress(true);

      const url = editingChemical
        ? `${API_BASE_URL}/${editingChemical.id}`
        : API_BASE_URL;

      const method = editingChemical ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(chemicalData),
      });

      if (!response.ok) {
        throw new Error(
          editingChemical ? "Failed to update chemical" : "Failed to create chemical"
        );
      }

      // Refetch data to get updated list
      await fetchData();

      // Reset form and state
      resetForm();
      setError(null);
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleEdit = (chemical: Chemical) => {
    // Convert array of synonyms back to comma-separated string
    const synonymsString = chemical.synonyms.join(", ");

    setFormData({
      name: chemical.name,
      shelf_id: chemical.shelf_id,
      formula: chemical.formula,
      formula_latex: chemical.formula_latex || "",
      synonyms: synonymsString,
      msds_url: chemical.msds_url || "",
      structure_2d_url: chemical.structure_2d_url || "",
      bottle_number: chemical.bottle_number,
      is_concentrated: chemical.is_concentrated || false,
    });

    setEditingChemical(chemical);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setEditingChemical(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (chemicalId: string) => {
    if (!window.confirm("Are you sure you want to delete this chemical?")) {
      return;
    }

    try {
      setActionInProgress(true);

      const response = await fetch(`${API_BASE_URL}/${chemicalId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete chemical");

      // Refetch data or remove from state
      setChemicals((prevChemicals) =>
        prevChemicals.filter((chem) => chem.id !== chemicalId)
      );

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setActionInProgress(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingChemical(null);
    setNextBottleNumber("");
    setPubChemError(null);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const openStructureViewer = (chemical: Chemical) => {
    setSelectedChemical(chemical);
    setIsStructureModalOpen(true);
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      // If search term is empty, reset to full list
      fetchData();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/search/?q=${encodeURIComponent(searchTerm)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Search failed");

      const searchResults = await response.json();
      setChemicals(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Process chemicals based on tab and sort settings
  const processedChemicals = chemicals
    .filter((chemical) => {
      // Tab filtering only (search is handled by API)
      if (activeTab === "all") return true;
      if (activeTab === "concentrated") return chemical.is_concentrated;
      if (activeTab === "regular") return !chemical.is_concentrated;
      return true;
    })
    .sort((a, b) => {
      // Handle different field types
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "formula") {
        return sortDirection === "asc"
          ? a.formula.localeCompare(b.formula)
          : b.formula.localeCompare(a.formula);
      } else if (sortField === "shelf") {
        const shelfA =
          shelves.find((shelf) => shelf.id === a.shelf_id)?.name || "";
        const shelfB =
          shelves.find((shelf) => shelf.id === b.shelf_id)?.name || "";
        return sortDirection === "asc"
          ? shelfA.localeCompare(shelfB)
          : shelfB.localeCompare(shelfA);
      } else if (sortField === "bottle_number") {
        return sortDirection === "asc"
          ? a.bottle_number.localeCompare(b.bottle_number)
          : b.bottle_number.localeCompare(a.bottle_number);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Chemicals</h1>
          <Button onClick={handleOpenAddModal}>
            <Plus className="mr-2 h-4 w-4" /> Add New Chemical
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Chemicals Inventory</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search chemicals, formulas, bottle numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  className="pl-8"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1.5"
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <Tabs
                defaultValue="all"
                className="w-full sm:w-auto"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="concentrated">Concentrated</TabsTrigger>
                  <TabsTrigger value="regular">Regular</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : processedChemicals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center">
                          Name
                          {sortField === "name" && (
                            <ChevronsUpDown
                              className={`ml-1 h-3 w-3 ${
                                sortDirection === "asc" ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold cursor-pointer"
                        onClick={() => handleSort("formula")}
                      >
                        <div className="flex items-center">
                          Formula
                          {sortField === "formula" && (
                            <ChevronsUpDown
                              className={`ml-1 h-3 w-3 ${
                                sortDirection === "asc" ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold cursor-pointer"
                        onClick={() => handleSort("shelf")}
                      >
                        <div className="flex items-center">
                          Shelf
                          {sortField === "shelf" && (
                            <ChevronsUpDown
                              className={`ml-1 h-3 w-3 ${
                                sortDirection === "asc" ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold cursor-pointer"
                        onClick={() => handleSort("bottle_number")}
                      >
                        <div className="flex items-center">
                          Bottle #
                          {sortField === "bottle_number" && (
                            <ChevronsUpDown
                              className={`ml-1 h-3 w-3 ${
                                sortDirection === "asc" ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedChemicals.map((chemical) => (
                      <tr
                        key={chemical.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium">{chemical.name}</div>
                          {chemical.synonyms && chemical.synonyms.length > 0 && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {chemical.synonyms.slice(0, 3).join(", ")}
                              {chemical.synonyms.length > 3 && " ..."}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono">
                          {formatFormula(chemical.formula)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span>
                              {chemical.shelf?.name ||
                                shelves.find(
                                  (shelf) => shelf.id === chemical.shelf_id
                                )?.name ||
                                "Unknown"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {chemical.shelf?.location || 
                                shelves.find(
                                  (shelf) => shelf.id === chemical.shelf_id
                                )?.location || 
                                ""}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {chemical.bottle_number}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {chemical.structure_2d_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openStructureViewer(chemical)}
                              >
                                <Microscope className="h-3 w-3 mr-1" />
                                Structure
                              </Button>
                            )}
                            {chemical.msds_url && (
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={chemical.msds_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
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
                              disabled={actionInProgress}
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

      {/* Chemical Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingChemical ? "Edit Chemical" : "Add New Chemical"}
            </DialogTitle>
            <DialogDescription>
              {editingChemical
                ? "Update the details of this chemical in the inventory."
                : "Add a new chemical to the inventory database."}
            </DialogDescription>
          </DialogHeader>
          
          {pubChemError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{pubChemError}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between items-center mb-2">
            <Button 
              variant="outline"
              onClick={populateFromPubChem}
              disabled={isPubChemLoading || (!formData.name && !formData.formula)}
            >
              {isPubChemLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Fetch from PubChem
            </Button>
            <div className="text-xs text-gray-500">
              Enter a name or formula and click to auto-populate
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Chemical Name*
              </label>
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
                onValueChange={(value) => handleInputChange("shelf_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a shelf" />
                </SelectTrigger>
                <SelectContent>
                  {shelves.map((shelf) => (
                    <SelectItem key={shelf.id} value={shelf.id}>
                      {shelf.name} ({shelf.location || ""})
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
              <label className="block text-sm font-medium mb-1">
                Formula LaTeX (Auto-generated)
              </label>
              <Input
                placeholder="E.g., H_2O"
                value={formData.formula_latex}
                onChange={(e) =>
                  handleInputChange("formula_latex", e.target.value)
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                This is automatically converted from formula
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Bottle Number*
              </label>
              <Input
                placeholder="E.g., A1-001"
                value={formData.bottle_number}
                onChange={(e) =>
                  handleInputChange("bottle_number", e.target.value)}
                  required
              />
              {nextBottleNumber && (
                <p className="text-xs text-gray-500 mt-1">
                  Suggested: {nextBottleNumber}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Synonyms (comma-separated)
              </label>
              <Input
                placeholder="E.g., table salt, NaCl, halite"
                value={formData.synonyms}
                onChange={(e) => handleInputChange("synonyms", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                MSDS URL
              </label>
              <Input
                placeholder="https://example.com/msds.pdf"
                value={formData.msds_url}
                onChange={(e) => handleInputChange("msds_url", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Structure 2D URL
              </label>
              <Input
                placeholder="https://example.com/structure.png"
                value={formData.structure_2d_url}
                onChange={(e) =>
                  handleInputChange("structure_2d_url", e.target.value)
                }
              />
            </div>

            <div className="flex items-center space-x-2 md:col-span-2">
              <Checkbox
                id="concentrated"
                checked={formData.is_concentrated}
                onCheckedChange={(checked) =>
                  handleInputChange("is_concentrated", checked === true)
                }
              />
              <label
                htmlFor="concentrated"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Is Concentrated (requires special handling)
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.name ||
                !formData.formula ||
                !formData.shelf_id ||
                !formData.bottle_number ||
                actionInProgress
              }
            >
              {actionInProgress ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingChemical ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <SaveAll className="mr-2 h-4 w-4" />
                  {editingChemical ? "Update Chemical" : "Add Chemical"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chemical Structure Viewer Modal */}
      {selectedChemical && (
        <ChemicalStructureViewer
          open={isStructureModalOpen}
          onOpenChange={() => setIsStructureModalOpen(false)}
          chemical={selectedChemical}
        />
      )}
    </div>
  );
}