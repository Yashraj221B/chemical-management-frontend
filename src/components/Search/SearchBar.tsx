"use client"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

export default function SearchBar({ search, setSearch }: { search: string, setSearch: React.Dispatch<React.SetStateAction<string>> }) {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search chemicals or formulas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10 py-3 border border-gray-300 rounded-xl w-full shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 transition-all bg-white"
      />
      <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      {search && (
        <button 
          onClick={() => setSearch("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  )
}
