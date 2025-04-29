// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chemicals from "./pages/chemicals";
import Login from "./pages/login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageShelves from "./pages/admin/ManageShelves";
import ManageChemicals from "./pages/admin/ManageChemicals";
import NotFoundPage from "./pages/404";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Chemicals />} />
          <Route path="/chemicals" element={<Chemicals />} />
          <Route path="/login" element={<Login />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/shelves"
            element={
              <ProtectedRoute adminOnly={true}>
                <ManageShelves />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/chemicals" 
            element={
              <ProtectedRoute adminOnly={true}>
                <ManageChemicals />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={
            <NotFoundPage />
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
