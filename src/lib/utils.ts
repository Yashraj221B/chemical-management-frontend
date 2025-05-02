import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getToken() {
  return localStorage.getItem("token")
}

export function isLoggedIn() {
  return !!getToken()
}

export function logout() {
  localStorage.removeItem("token")
}

export function formatFormulaLatex(formula: string) {
  if (!formula) {
      return "";
  }

  // Replace digits with subscript notation
  let formulaLatex = formula.replace(/(\d+)/g, '_{$1}');

  // Replace charges with superscript notation
  formulaLatex = formulaLatex
      .replace(/_\+/, '^+')
      .replace(/_-/, '^-')
      .replace(/_\{\+/, '^{+')
      .replace(/_\{-/, '^{-');

  return formulaLatex;
}

export function formatFormula(formula: string) {
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

export async function fetchFromPubChem(query: string) {
  const PUBCHEM_API_URL = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
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
    console.error(err);
    return null;
  }
}

export async function getCompoundDataByCID(cid: number, matchedName: string) {
  const PUBCHEM_API_URL = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
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
}
