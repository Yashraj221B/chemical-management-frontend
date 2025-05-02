import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Chemical {
  id: string;
  name: string;
  formula: string;
  shelf: string;
  bottle_number: string;
}

interface ChemicalTableProps {
  chemicals: Chemical[];
  onEdit: (chemical: Chemical) => void;
  onDelete: (chemicalId: string) => void;
}

const ChemicalTable: React.FC<ChemicalTableProps> = ({ chemicals, onEdit, onDelete }) => {
  const [sortedChemicals, setSortedChemicals] = useState<Chemical[]>([]);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setSortedChemicals([...chemicals].sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortField === 'formula') {
        return sortDirection === 'asc' ? a.formula.localeCompare(b.formula) : b.formula.localeCompare(a.formula);
      } else if (sortField === 'shelf') {
        return sortDirection === 'asc' ? a.shelf.localeCompare(b.shelf) : b.shelf.localeCompare(a.shelf);
      } else if (sortField === 'bottle_number') {
        return sortDirection === 'asc' ? a.bottle_number.localeCompare(b.bottle_number) : b.bottle_number.localeCompare(a.bottle_number);
      }
      return 0;
    }));
  }, [chemicals, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b" onClick={() => handleSort('name')}>
              Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-2 px-4 border-b" onClick={() => handleSort('formula')}>
              Formula {sortField === 'formula' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-2 px-4 border-b" onClick={() => handleSort('shelf')}>
              Shelf {sortField === 'shelf' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-2 px-4 border-b" onClick={() => handleSort('bottle_number')}>
              Bottle Number {sortField === 'bottle_number' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedChemicals.map((chemical) => (
            <tr key={chemical.id}>
              <td className="py-2 px-4 border-b">{chemical.name}</td>
              <td className="py-2 px-4 border-b">{chemical.formula}</td>
              <td className="py-2 px-4 border-b">{chemical.shelf}</td>
              <td className="py-2 px-4 border-b">{chemical.bottle_number}</td>
              <td className="py-2 px-4 border-b">
                <Button variant="outline" size="sm" onClick={() => onEdit(chemical)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(chemical.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChemicalTable;
