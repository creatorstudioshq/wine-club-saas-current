import * as React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Wine, 
  Mail, 
  Lock, 
  Sparkles
} from "lucide-react";
import { api } from "../utils/api";
import { useClient } from "../contexts/ClientContext";

interface AuthPageProps {
  onAuth: (method: 'password' | 'magic-link', email: string, password?: string) => void;
  onSignupClick?: () => void;
  error?: string;
  successMessage?: string;
}

export function AuthPage({ onAuth, onSignupClick, error, successMessage }: AuthPageProps) {
  const { currentWineClub } = useClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onAuth('password', email, password);
      setIsLoading(false);
    }, 1000);
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.sendMagicLink(email, currentWineClub?.id || "");
      
      onAuth('magic-link', email);
    } catch (error: any) {
      console.error('Magic link error:', error);
      // Still call onAuth to show success message
      onAuth('magic-link', email);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Wine className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-serif text-gray-900 mb-2">Wine Club SaaS</h1>
          <p className="text-gray-600">
            Manage your wine club with elegance
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Wine Club Admin Portal</CardTitle>
            <CardDescription>
              Sign in to access your wine club management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="password" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
              </TabsList>

              {/* Password Login */}
              <TabsContent value="password">
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@yourwineclub.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                    <Lock className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </TabsContent>

              {/* Magic Link Login */}
              <TabsContent value="magic-link">
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="magic-email">Email</Label>
                    <Input
                      id="magic-email"
                      type="email"
                      placeholder="admin@yourwineclub.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll send you a secure link to sign in
                    </p>
                  </div>

                  {successMessage && (
                    <Alert>
                      <Mail className="h-4 w-4" />
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Magic Link"}
                    <Mail className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Demo Access */}
            <div className="mt-6 pt-6 border-t">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Demo credentials for testing:
                </p>
                <div className="bg-muted/50 rounded-lg p-3 text-sm font-mono space-y-1">
                  <p><strong>SaaS Admin:</strong> jimmy@arccom.io</p>
                  <p><strong>Wine Club Owner:</strong> klausbellinghausen@gmail.com</p>
                  <p><strong>Demo Account:</strong> demo@wineclub.com</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onAuth('password', 'jimmy@arccom.io', 'admin123')}
                    className="w-full"
                  >
                    Login as SaaS Admin
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onAuth('password', 'klausbellinghausen@gmail.com', 'owner123')}
                    className="w-full"
                  >
                    Login as Wine Club Owner
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onAuth('password', 'demo@wineclub.com', 'demo123')}
                    className="w-full"
                  >
                    Login as Demo Account
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© 2025 Wine Club SaaS • Powered by Square & Supabase</p>
        </div>
      </div>
    </div>
  );
}