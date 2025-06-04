"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Beaker,
  Check,
  Clipboard,
  ExternalLink,
  Info,
  MapPin,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

interface ChemicalDetails {
  name: string;
  shelf_id: string;
  formula: string;
  formula_latex: string;
  synonyms: string[];
  location: string;
  msds_url: string;
  structure_2d_url: string;
  bottle_number: string;
  is_concentrated: boolean;
  shelf: {
    name: string;
    location: string;
    id: string;
  };
  id: string;
}

interface ChemicalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  chemicalId: string;
}

// Format chemical formulas with proper subscripts and superscripts
function FormulaDisplay({ formula }: { formula: string }) {
  return (
    <>
      {formula.split("").map((char, index) => {
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
      })}
    </>
  );
}

// Component for the Details tab content
const DetailsTabContent = ({ chemical }: { chemical: ChemicalDetails }) => (
  <div className="mt-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500 mb-3">
          Location Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm font-medium">Shelf:</span>
            <span className="text-sm ml-2">
              {chemical.shelf.name} ({chemical.shelf.location})
            </span>
          </div>
          <div className="flex items-center">
            <Beaker className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm font-medium">Bottle Number:</span>
            <span className="text-sm ml-2">{chemical.bottle_number}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Identifiers</h3>
        <div>
          <div className="text-sm mb-2">
            <span className="font-medium">Chemical ID: </span>
            <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">
              {chemical.id}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Shelf ID: </span>
            <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">
              {chemical.shelf_id}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-gray-500 mb-3">Synonyms</h3>
      <div className="flex flex-wrap gap-2">
        {chemical.synonyms.map((synonym, index) => (
          <Badge key={index} variant="outline" className="bg-white">
            {synonym}
          </Badge>
        ))}
      </div>
    </div>
  </div>
);

// Component for the Structure tab content
const StructureTabContent = ({ chemical }: { chemical: ChemicalDetails }) => (
  <div className="mt-4">
    <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
      <h3 className="text-sm font-medium text-gray-500 mb-3 self-start">
        2D Structure
      </h3>
      {chemical.structure_2d_url && (
        <div className="p-4 bg-white rounded-lg border shadow-sm max-w-full">
          <img
            src={chemical.structure_2d_url}
            alt={`2D structure of ${chemical.name}`}
            className="max-h-64 object-contain max-w-full"
          />
        </div>
      )}
    </div>
  </div>
);

// Component for the Safety tab content
const SafetyTabContent = ({ chemical }: { chemical: ChemicalDetails }) => (
  <div className="mt-4">
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">Safety Data Sheet</h3>
        {chemical.msds_url && (
          <a
            href={chemical.msds_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
          >
            View MSDS <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </a>
        )}
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-800 font-medium">
              Always handle chemicals with appropriate safety precautions
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Refer to the Safety Data Sheet (MSDS) for complete safety
              information before handling this chemical.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function ChemicalDetailsModal({
  isOpen,
  onClose,
  chemicalId,
}: ChemicalDetailsModalProps) {
  const [chemical, setChemical] = useState<ChemicalDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [copySuccess, setCopySuccess] = useState(false);

  // Fetch chemical details when modal opens
  useEffect(() => {
    const fetchChemicalDetails = async () => {
      if (isOpen && chemicalId) {
        try {
          setLoading(true);
          setError(null);

          // Replace with your actual API endpoint
          const response = await fetch(
            `${VITE_BACKEND_URL}/chemicals/${chemicalId}`
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();
          setChemical(data);
        } catch (err) {
          setError("Failed to fetch chemical details");
          console.error("Error fetching chemical details:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchChemicalDetails();
  }, [isOpen, chemicalId]);

  const handleCopyFormula = () => {
    if (chemical) {
      navigator.clipboard.writeText(chemical.formula_latex);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        ) : error ? (
          <div className="p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : chemical ? (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="max-w-full">
                  <DialogTitle className="text-2xl font-bold text-ellipsis overflow-hidden">
                    {chemical.name}
                  </DialogTitle>
                  <DialogDescription className="mt-1 flex items-center flex-wrap">
                    <div className="px-2 py-1 bg-blue-100 rounded-md text-blue-800 text-sm font-medium mr-2 flex items-center mb-1">
                      <FormulaDisplay formula={chemical.formula} />
                      <button
                        onClick={handleCopyFormula}
                        className="ml-2 text-blue-700 hover:text-blue-900"
                        title="Copy formula"
                      >
                        {copySuccess ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Clipboard className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    {chemical.is_concentrated && (
                      <Badge variant="destructive" className="ml-2">
                        Concentrated
                      </Badge>
                    )}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-4"
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger
                  value="details"
                  className="flex items-center gap-1"
                >
                  <Info className="h-4 w-4" />
                  <span>Details</span>
                </TabsTrigger>
                <TabsTrigger
                  value="structure"
                  className="flex items-center gap-1"
                >
                  <Beaker className="h-4 w-4" />
                  <span>Structure</span>
                </TabsTrigger>
                <TabsTrigger value="safety" className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>Safety</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <DetailsTabContent chemical={chemical} />
              </TabsContent>

              <TabsContent value="structure">
                <StructureTabContent chemical={chemical} />
              </TabsContent>

              <TabsContent value="safety">
                <SafetyTabContent chemical={chemical} />
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No chemical data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
