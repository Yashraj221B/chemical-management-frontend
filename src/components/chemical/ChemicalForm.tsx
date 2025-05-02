import React, { useState, useEffect } from 'react';
import { Input, Select, Checkbox, Button } from '@/components/ui';

interface ChemicalFormProps {
  initialData?: {
    name: string;
    shelf_id: string;
    formula: string;
    formula_latex: string;
    synonyms: string;
    msds_url: string;
    structure_2d_url: string;
    bottle_number: string;
    is_concentrated: boolean;
  };
  onSubmit: (data: any) => void;
  shelves: { id: string; name: string; location: string }[];
  nextBottleNumber: string;
  isPubChemLoading: boolean;
  pubChemError: string | null;
  populateFromPubChem: () => void;
}

const ChemicalForm: React.FC<ChemicalFormProps> = ({
  initialData,
  onSubmit,
  shelves,
  nextBottleNumber,
  isPubChemLoading,
  pubChemError,
  populateFromPubChem,
}) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    shelf_id: '',
    formula: '',
    formula_latex: '',
    synonyms: '',
    msds_url: '',
    structure_2d_url: '',
    bottle_number: '',
    is_concentrated: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div>
      {pubChemError && (
        <div className="alert alert-danger">
          {pubChemError}
        </div>
      )}

      <div className="flex justify-between items-center mb-2">
        <Button 
          variant="outline"
          onClick={populateFromPubChem}
          disabled={isPubChemLoading || (!formData.name && !formData.formula)}
        >
          {isPubChemLoading ? 'Loading...' : 'Fetch from PubChem'}
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
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Shelf*</label>
          <Select
            value={formData.shelf_id}
            onValueChange={(value) => handleInputChange('shelf_id', value)}
          >
            <Select.Trigger>
              <Select.Value placeholder="Select a shelf" />
            </Select.Trigger>
            <Select.Content>
              {shelves.map((shelf) => (
                <Select.Item key={shelf.id} value={shelf.id}>
                  {shelf.name} ({shelf.location || ''})
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Formula*</label>
          <Input
            placeholder="E.g., H2O"
            value={formData.formula}
            onChange={(e) => handleInputChange('formula', e.target.value)}
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
              handleInputChange('formula_latex', e.target.value)
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
              handleInputChange('bottle_number', e.target.value)}
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
            onChange={(e) => handleInputChange('synonyms', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            MSDS URL
          </label>
          <Input
            placeholder="https://example.com/msds.pdf"
            value={formData.msds_url}
            onChange={(e) => handleInputChange('msds_url', e.target.value)}
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
              handleInputChange('structure_2d_url', e.target.value)
            }
          />
        </div>

        <div className="flex items-center space-x-2 md:col-span-2">
          <Checkbox
            id="concentrated"
            checked={formData.is_concentrated}
            onCheckedChange={(checked) =>
              handleInputChange('is_concentrated', checked === true)
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

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setFormData(initialData || {
          name: '',
          shelf_id: '',
          formula: '',
          formula_latex: '',
          synonyms: '',
          msds_url: '',
          structure_2d_url: '',
          bottle_number: '',
          is_concentrated: false,
        })}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            !formData.name ||
            !formData.formula ||
            !formData.shelf_id ||
            !formData.bottle_number
          }
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ChemicalForm;
