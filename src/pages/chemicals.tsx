// Chemicals.tsx
import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import SearchBar from "@/components/SearchBar"
import FilterBar from "@/components/FilterBar"
import ChemicalCard from "@/components/ChemicalCard"
import ChemicalDetailsModal from "@/components/ChemicalDetailsModal"
import EmptyState from "@/components/EmptyState"
import { LayoutGrid, Table, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

const BACKEND_URL = import.meta.env.BACKEND_URL || "http://localhost:8000";

interface Chemical {
  id: string;
  name: string;
  formula: string;
  formula_latex?: string;
  location: string;
  bottle_number: string;
  synonyms?: string[];
  msds_url?: string;
  structure_2d_url?: string;
  is_concentrated?: boolean;
  shelf_id?: string;
  shelf?: {
    name: string;
    location: string;
    id: string;
  };
}

function formatFormula(formula: string) {
  return formula.split("").map((char, index) => {
    if (!isNaN(Number(char))) {
      return (
        <sub key={index} className="text-xs">
          {char}
        </sub>
      )
    }
    if (char === "+") {
      return (
        <sup key={index} className="text-xs">
          {char}
        </sup>
      )
    }
    return char
  })
}

export default function Home() {
  const [chemicals, setChemicals] = useState<Chemical[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [viewMode, setViewMode] = useState("card")
  const [selectedChemicalId, setSelectedChemicalId] = useState<string | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  useEffect(() => {
    const fetchChemicals = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${BACKEND_URL}/chemicals/`)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        
        const data = await response.json()
        setChemicals(data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch chemicals data")
        console.error("Error fetching chemicals:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchChemicals()
  }, [])

  const filteredChemicals = chemicals.filter((chemical) =>
    (chemical.name.toLowerCase().includes(search.toLowerCase()) ||
     chemical.formula.toLowerCase().includes(search.toLowerCase())) &&
    (selectedLocation ? chemical.location === selectedLocation : true)
  )

  const uniqueLocations = [...new Set(chemicals.map(c => c.location))]

  const handleViewDetails = (chemicalId: string) => {
    setSelectedChemicalId(chemicalId)
    setIsDetailsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedChemicalId(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl w-full mx-auto px-4 py-6 flex-grow">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center">
            <div className="flex-grow">
              <SearchBar search={search} setSearch={setSearch} />
            </div>
            <div className="bg-white rounded-lg shadow-sm flex p-1 ml-4">
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded ${viewMode === "card" ? "bg-blue-100 text-blue-600" : ""}`}
                title="Card view"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded ${viewMode === "table" ? "bg-blue-100 text-blue-600" : ""}`}
                title="Table view"
              >
                <Table size={20} />
              </button>
            </div>
          </div>
          <div>
            <FilterBar uniqueLocations={uniqueLocations} handleFilter={setSelectedLocation} />
          </div>
        </div>
  
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error} - Please check your API connection.
          </div>
        ) : filteredChemicals.length === 0 ? (
          <EmptyState />
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChemicals.map((chemical) => (
              <ChemicalCard 
                key={chemical.id} 
                chemical={chemical} 
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formula</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shelf</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bottle Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredChemicals.map((chemical) => (
                  <tr key={chemical.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{chemical.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatFormula(chemical.formula)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{chemical.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{chemical.shelf?.name || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{chemical.bottle_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => handleViewDetails(chemical.id)}
                      >
                        <Eye size={16} className="mr-1" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Centralized Chemical Details Modal */}
      {selectedChemicalId && (
        <ChemicalDetailsModal 
          isOpen={isDetailsModalOpen}
          onClose={handleCloseModal}
          chemicalId={selectedChemicalId}
        />
      )}
    </div>
  );
}