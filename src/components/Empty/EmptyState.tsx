"use client"
import { Beaker } from "lucide-react"

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-gray-100 p-6 mb-4">
        <Beaker className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-700">No chemicals found</h3>
      <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
    </div>
  )
}
