import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CheckCircle, XCircle, AlertCircle, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner@2.0.3";

type Environment = 'sandbox' | 'production';

export function SquareAuthDiagnostic() {
  const [sandboxToken, setSandboxToken] = useState("");
  const [productionToken, setProductionToken] = useState("");
  const [testing, setTesting] = useState<Environment | null>(null);
  const [sandboxResult, setSandboxResult] = useState<any>(null);
  const [productionResult, setProductionResult] = useState<any>(null);

  const testToken = async (token: string, environment: Environment) => {
    if (!token.trim()) {
      toast.error('Please enter a token to test');
      return;
    }

    setTesting(environment);
    const apiUrl = environment === 'sandbox' 
      ? 'https://connect.squareupsandbox.com/v2/catalog/list'
      : 'https://connect.squareup.com/v2/catalog/list';

    try {
      const response = await fetch(`${apiUrl}?types=ITEM&limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Square-Version': '2024-01-18',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      const result = {
        success: response.ok,
        status: response.status,
        itemCount: data.objects?.length || 0,
        response: data
      };

      if (environment === 'sandbox') {
        setSandboxResult(result);
      } else {
        setProductionResult(result);
      }

      if (response.ok) {
        toast.success(`${environment === 'sandbox' ? 'Sandbox' : 'Production'} token verified!`);
      } else {
        toast.error(`Token test failed with status ${response.status}`);
      }
    } catch (error: any) {
      const result = {
        success: false,
        error: error.message
      };
      
      if (environment === 'sandbox') {
        setSandboxResult(result);
      } else {
        setProductionResult(result);
      }
      
      toast.error(`Test failed: ${error.message}`);
    } finally {
      setTesting(null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const TokenTestCard = ({ 
    environment, 
    token, 
    setToken, 
    result 
  }: { 
    environment: Environment;
    token: string;
    setToken: (value: string) => void;
    result: any;
  }) => {
    const isProduction = environment === 'production';
    const envLabel = isProduction ? 'Production' : 'Sandbox (Development)';
    const squareUrl = isProduction 
      ? 'https://developer.squareup.com/apps'
      : 'https://developer.squareup.com/apps';

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {envLabel} Token
            <Badge variant={isProduction ? "default" : "secondary"}>
              {isProduction ? 'Live' : 'Testing'}
            </Badge>
          </CardTitle>
          <CardDescription>
            {isProduction 
              ? 'Your live Square account for processing real transactions'
              : 'Your Square sandbox account for testing and development'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">How to get your {envLabel} token:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
                  <li>Go to <a href={squareUrl} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">
                    Square Developer Dashboard <ExternalLink className="h-3 w-3" />
                  </a></li>
                  <li>Select your {isProduction ? 'production' : 'sandbox'} application</li>
                  <li>Click on the "Credentials" tab</li>
                  <li>Copy the <strong>{isProduction ? 'Production' : 'Sandbox'} Access Token</strong> (starts with "EAAAE...")</li>
                  <li>Paste it below to test, then add to Vercel</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>

          {/* Token Input */}
          <div className="space-y-2">
            <Label>{envLabel} Access Token</Label>
            <div className="flex gap-2">
              <Input 
                type="password"
                placeholder="Paste your Square access token here (EAAAE...)"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="flex-1 font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setToken('')}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Test Button */}
          <Button 
            onClick={() => testToken(token, environment)}
            disabled={!token.trim() || testing === environment}
            className="w-full"
          >
            {testing === environment ? 'Testing...' : `Test ${envLabel} Token`}
          </Button>

          {/* Results */}
          {result && (
            <div className="space-y-3">
              {result.success ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Token Works!</span>
                  </div>
                  <p className="text-sm text-green-800">
                    Successfully connected to Square {envLabel} API. Found {result.itemCount} items in your catalog.
                  </p>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(token, `${envLabel} token`)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Token
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-900">Token Failed</span>
                  </div>
                  <div className="text-sm text-red-800 space-y-2">
                    <p>Status: {result.status || 'Network Error'}</p>
                    {result.error && <p>Error: {result.error}</p>}
                    {result.response?.errors && (
                      <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(result.response.errors, null, 2)}
                      </pre>
                    )}
                    <p className="text-xs mt-2">
                      Make sure you're using the correct <strong>{envLabel}</strong> token from the Square Developer Dashboard.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Square Integration Setup</h1>
        <p className="text-muted-foreground">
          Configure your Square API credentials for development and production
        </p>
      </div>

      <Tabs defaultValue="sandbox" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sandbox">Development (Sandbox)</TabsTrigger>
          <TabsTrigger value="production">Production (Live)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sandbox" className="space-y-4">
          <TokenTestCard 
            environment="sandbox"
            token={sandboxToken}
            setToken={setSandboxToken}
            result={sandboxResult}
          />
        </TabsContent>
        
        <TabsContent value="production" className="space-y-4">
          <TokenTestCard 
            environment="production"
            token={productionToken}
            setToken={setProductionToken}
            result={productionResult}
          />
        </TabsContent>
      </Tabs>

      {/* Vercel Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Add to Vercel Environment Variables</CardTitle>
          <CardDescription>
            Once your tokens are verified, add them to your Vercel project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Steps to add environment variables to Vercel:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
                  <li>Go to your <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">
                    Vercel Dashboard <ExternalLink className="h-3 w-3" />
                  </a></li>
                  <li>Select your wine club project</li>
                  <li>Go to Settings → Environment Variables</li>
                  <li>Add or update <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-xs">SQUARE_ACCESS_TOKEN</code></li>
                  <li>Paste your <strong>verified token</strong> from above</li>
                  <li>Select the appropriate environment (Development/Production/Both)</li>
                  <li>Click "Save" and redeploy your application</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <code className="text-sm font-mono">SQUARE_ACCESS_TOKEN</code>
                <Badge variant="destructive">Required</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Your Square Access Token (use Sandbox for development, Production for live)
              </p>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <code className="text-sm font-mono">SQUARE_LOCATION_ID</code>
                <Badge variant="secondary">Optional</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Your Square Location ID (found in Square Dashboard → Locations)
              </p>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <code className="text-sm font-mono">SQUARE_APPLICATION_ID</code>
                <Badge variant="secondary">Optional</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Your Square Application ID (needed for payment processing)
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
            <p className="text-sm text-blue-900 font-medium">
              💡 Important Notes:
            </p>
            <ul className="text-sm text-blue-900 space-y-1 ml-4 list-disc">
              <li>Use <strong>Sandbox</strong> tokens for development and testing</li>
              <li>Use <strong>Production</strong> tokens only for your live environment</li>
              <li>Never commit tokens to your git repository</li>
              <li>After adding or updating variables, redeploy your application</li>
              <li>You can switch between environments using the Vercel dashboard</li>
            </ul>
          </div>

          <Button 
            className="w-full"
            onClick={() => window.open('https://vercel.com/dashboard', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Vercel Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
