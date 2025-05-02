// src/pages/login.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Lock, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = (location.state as LocationState)?.from?.pathname || "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      // Use auth context to login
      login(data.access_token, {
        username: form.username,
        isAdmin: data.is_admin || false
      });

      // Navigate to the page user was trying to access or to home
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to ChemTrack</CardTitle>
            <CardDescription className="text-gray-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-red-500 text-red-600 bg-red-50">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    placeholder="username"
                    value={form.username}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col mt-4 space-y-4">
              <Button 
                type="submit" 
                className={cn(
                  "w-full bg-blue-600 hover:bg-blue-700 text-white",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}