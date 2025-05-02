"use client"
import { Card, CardContent } from "@/components/ui/Card"
import { MapPin, Hash } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { formatFormula } from "@/lib/utils"

interface ChemicalCardProps {
  chemical: { 
    name: string, 
    formula: string, 
    location: string, 
    bottle_number: string,
    id: string
  };
  onViewDetails: (chemicalId: string) => void;
}

export default function ChemicalCard({ chemical, onViewDetails }: ChemicalCardProps) {
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border-0 shadow-md bg-white rounded-xl"
      onClick={() => onViewDetails(chemical.id)}
    >
      <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">{chemical.name}</h2>
          <div className="px-2 py-1 bg-blue-100 rounded-md text-blue-800 text-xs font-medium">
            {formatFormula(chemical.formula)}
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm">{chemical.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Hash className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm">Bottle No: {chemical.bottle_number}</span>
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(chemical.id);
              }}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
