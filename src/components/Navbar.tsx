// src/components/Navbar.tsx
"use client"
import { Beaker, ChevronDown, Menu, X, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [adminMenu, setAdminMenu] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Beaker className="h-6 w-6 text-blue-600" />
          <Link to="/" className="font-semibold text-xl text-gray-800">ChemTrack</Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-blue-600 font-medium">Chemicals</Link>
          
          {isAuthenticated && (
            <div className="relative">
              <button 
                className="flex items-center text-gray-600 hover:text-blue-600 focus:outline-none"
                onClick={() => setAdminMenu(!adminMenu)}
              >
                Admin
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              
              {adminMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link 
                    to="/admin" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setAdminMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/shelves" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setAdminMenu(false)}
                  >
                    Manage Shelves
                  </Link>
                  <Link 
                    to="/admin/chemicals" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setAdminMenu(false)}
                  >
                    Manage Chemicals
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <Avatar className="h-9 w-9 bg-blue-100 text-blue-600">
                  <AvatarFallback>{user ? getInitials(user.username) : "US"}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">{user?.username}</span>
              </div>
              <Button variant="default" size="sm" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenu && (
        <div className="md:hidden mt-3 pb-3 border-t border-gray-100">
          <div className="flex flex-col space-y-3 pt-3">
            <Link to="/chemicals" className="text-blue-600 font-medium px-2">Chemicals</Link>
            
            {isAuthenticated && (
              <>
                <Link to="/admin" className="text-gray-600 font-medium px-2 flex items-center">
                  <Layers className="h-4 w-4 mr-2" /> Admin Dashboard
                </Link>
                <Link to="/admin/shelves" className="text-gray-600 font-medium px-2 flex items-center">
                  <Layers className="h-4 w-4 mr-2" /> Manage Shelves
                </Link>
                <Link to="/admin/chemicals" className="text-gray-600 font-medium px-2 flex items-center">
                  <Beaker className="h-4 w-4 mr-2" /> Manage Chemicals
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}