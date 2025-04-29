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
