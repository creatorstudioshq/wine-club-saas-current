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
    
    try {
      await api.signInWithPassword(email, password);
      onAuth('password', email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      // Still call onAuth to show error message
      onAuth('password', email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.sendMagicLink(email);
      onAuth('magic-link', email);
    } catch (error: any) {
      console.error('Magic link error:', error);
      // Still call onAuth to show success message
      onAuth('magic-link', email);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert('Please enter your email address first');
      return;
    }
    
    setIsLoading(true);
    try {
      await api.resetPassword(email);
      alert('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      alert('Failed to send password reset email. Please try again.');
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
                  
                  <div className="text-center">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleForgotPassword}
                      disabled={isLoading}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      Forgot your password?
                    </Button>
                  </div>
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
                  Need help? Contact your wine club administrator.
                </p>
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