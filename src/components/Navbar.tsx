"use client"
import { Beaker, ChevronDown, Menu, X, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import "@/components/Navbar.css"

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
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Beaker className="navbar-icon" />
          <Link to="/" className="navbar-title">ChemTrack</Link>
        </div>

        <div className="navbar-links">
          <Link to="/chemicals" className="navbar-link">Chemicals</Link>
          
          {isAuthenticated && (
            <div className="navbar-admin">
              <button 
                className="navbar-admin-button"
                onClick={() => setAdminMenu(!adminMenu)}
              >
                Admin
                <ChevronDown className="navbar-admin-icon" />
              </button>
              
              {adminMenu && (
                <div className="navbar-admin-menu">
                  <Link 
                    to="/admin" 
                    className="navbar-admin-item"
                    onClick={() => setAdminMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/shelves" 
                    className="navbar-admin-item"
                    onClick={() => setAdminMenu(false)}
                  >
                    Manage Shelves
                  </Link>
                  <Link 
                    to="/admin/chemicals" 
                    className="navbar-admin-item"
                    onClick={() => setAdminMenu(false)}
                  >
                    Manage Chemicals
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <div className="navbar-user">
                <Avatar className="navbar-avatar">
                  <AvatarFallback>{user ? getInitials(user.username) : "US"}</AvatarFallback>
                </Avatar>
                <span className="navbar-username">{user?.username}</span>
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
            className="navbar-mobile-button"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X className="navbar-mobile-icon" /> : <Menu className="navbar-mobile-icon" />}
          </Button>
        </div>
      </div>

      {mobileMenu && (
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-links">
            <Link to="/chemicals" className="navbar-mobile-link">Chemicals</Link>
            
            {isAuthenticated && (
              <>
                <Link to="/admin" className="navbar-mobile-admin-link">
                  <Layers className="navbar-mobile-admin-icon" /> Admin Dashboard
                </Link>
                <Link to="/admin/shelves" className="navbar-mobile-admin-link">
                  <Layers className="navbar-mobile-admin-icon" /> Manage Shelves
                </Link>
                <Link to="/admin/chemicals" className="navbar-mobile-admin-link">
                  <Beaker className="navbar-mobile-admin-icon" /> Manage Chemicals
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
