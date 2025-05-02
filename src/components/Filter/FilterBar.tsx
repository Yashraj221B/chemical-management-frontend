"use client"
import { Badge } from "@/components/ui/badge"

export default function FilterBar({ uniqueLocations, handleFilter }: { uniqueLocations: string[], handleFilter: (location: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
      <Badge 
        variant="outline" 
        className="bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer"
        onClick={() => handleFilter("")}
      >
        All Locations
      </Badge>
      {uniqueLocations.map(location => (
        <Badge 
          key={location} 
          variant="outline" 
          className="bg-white hover:bg-gray-100 cursor-pointer"
          onClick={() => handleFilter(location)}
        >
          {location}
        </Badge>
      ))}
    </div>
  )
}
