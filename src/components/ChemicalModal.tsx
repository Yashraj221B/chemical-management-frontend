import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";

interface ChemicalDetails {
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
    id: string;
  };
  id: string;
}

interface ChemicalStructureViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chemical: ChemicalDetails | null;
}

export default function ChemicalStructureViewer({
  open,
  onOpenChange,
  chemical,
}: ChemicalStructureViewerProps) {
  const [activeTab, setActiveTab] = useState("2d");

  if (!chemical) return null;

  const has2d = Boolean(chemical.structure_2d_url);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{chemical.name} - Molecular Structure</DialogTitle>
        </DialogHeader>

        {(has2d) && (
          <Tabs
            defaultValue={"2d"}
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center mb-4">
              <TabsList>
                {has2d && <TabsTrigger value="2d">2D Structure</TabsTrigger>}
              </TabsList>
            </div>

            {has2d && (
              <TabsContent value="2d" className="mt-0">
                <div className="flex justify-center p-2 bg-gray-50 rounded-md">
                  <img
                    src={chemical.structure_2d_url}
                    alt={`${chemical.name} - 2D Structure`}
                    className="max-w-full max-h-[50vh] object-contain"
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>
        )}

        {!has2d && (
          <div className="text-center py-8 text-gray-500">
            No structure images available for this chemical.
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {activeTab === "2d" && has2d && (
            <Button asChild variant="secondary">
              <a
                href={chemical.structure_2d_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Open 2D Original
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}