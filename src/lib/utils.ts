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
