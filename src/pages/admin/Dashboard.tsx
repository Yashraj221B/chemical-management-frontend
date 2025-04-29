// src/pages/admin/Dashboard.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Beaker, Layers, AlertTriangle, Database, Users } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalChemicals: 0,
    totalShelves: 0,
    alertsCount: 0
  });

  useEffect(() => {
    // In a real app, fetch these stats from your backend
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // This would be a real API call
      // const response = await fetch('http://localhost:8000/admin/stats');
      // const data = await response.json();
      // setStats(data);
      
      // For demo purposes:
      setStats({
        totalChemicals: 32,
        totalShelves: 8,
        alertsCount: 3
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Chemicals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Beaker className="h-8 w-8 text-blue-500 mr-3" />
                <span className="text-3xl font-bold">{stats.totalChemicals}</span>
              </div>
              <Link to="/admin/chemicals" className="text-blue-600 text-sm mt-4 block hover:underline">
                Manage chemicals →
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Shelves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Layers className="h-8 w-8 text-green-500 mr-3" />
                <span className="text-3xl font-bold">{stats.totalShelves}</span>
              </div>
              <Link to="/admin/shelves" className="text-blue-600 text-sm mt-4 block hover:underline">
                Manage shelves →
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-amber-500 mr-3" />
                <span className="text-3xl font-bold">{stats.alertsCount}</span>
              </div>
              <div className="text-amber-600 text-sm mt-4 block">
                {stats.alertsCount} chemicals need attention
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Database Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Database className="h-8 w-8 text-indigo-500 mr-3" />
                <span className="text-lg font-semibold text-green-600">Healthy</span>
              </div>
              <div className="text-gray-600 text-sm mt-4 block">
                Last backup: Today at 03:00 AM
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-sm border-none">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/admin/chemicals/new" className="flex items-center text-blue-600 hover:text-blue-800">
                <Beaker className="h-5 w-5 mr-2" />
                Add New Chemical
              </Link>
              <Link to="/admin/shelves/new" className="flex items-center text-blue-600 hover:text-blue-800">
                <Layers className="h-5 w-5 mr-2" />
                Add New Shelf
              </Link>
              <Link to="/admin/export" className="flex items-center text-blue-600 hover:text-blue-800">
                <Database className="h-5 w-5 mr-2" />
                Export Inventory
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-none">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="rounded-full bg-blue-100 p-2 mr-3">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Admin added a new chemical: Hydrogen Peroxide</p>
                    <p className="text-xs text-gray-500">Today at 10:30 AM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="rounded-full bg-green-100 p-2 mr-3">
                    <Layers className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Shelf "Organic Compounds" was updated</p>
                    <p className="text-xs text-gray-500">Yesterday at 4:15 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="rounded-full bg-amber-100 p-2 mr-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Alert: Low inventory for Sodium Hydroxide</p>
                    <p className="text-xs text-gray-500">Yesterday at 2:30 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}