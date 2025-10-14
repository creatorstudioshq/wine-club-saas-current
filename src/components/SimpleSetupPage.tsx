import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Wine, ExternalLink } from "lucide-react";
import { api } from "../utils/api";

const KING_FROSCH_ID = "550e8400-e29b-41d4-a716-446655440000";

export function SimpleSetupPage() {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState('');
  const [inventoryCount, setInventoryCount] = useState<number | null>(null);
  const [squareEnvironment, setSquareEnvironment] = useState<string>('unknown');

  const testSquareConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('idle');
    
    try {
      // First do a quick health check
      const healthCheck = await api.checkSquareHealth(KING_FROSCH_ID);
      
      if (!healthCheck.has_credentials || healthCheck.status === 'not_configured') {
        setConnectionStatus('error');
        setTestResult('Square not configured. Add your Square credentials to environment variables.');
        setInventoryCount(0);
        setSquareEnvironment('Not configured');
        return;
      }
      
      if (healthCheck.status === 'error') {
        setConnectionStatus('error');
        setTestResult(`Configuration error: ${healthCheck.error || 'Unknown error'}`);
        setInventoryCount(0);
        setSquareEnvironment('Error');
        return;
      }
      
      // If health check passes, test with a small inventory fetch
      const response = await api.getLiveInventory(KING_FROSCH_ID, 'all', 3);
      
      if (response.isDemoMode) {
        setConnectionStatus('error');
        setTestResult('Square credentials detected but connection failed. Check your token validity.');
        setInventoryCount(0);
        setSquareEnvironment(healthCheck.environment || 'Error');
      } else if (response.error) {
        setConnectionStatus('error');
        setTestResult(`Connection failed: ${response.message || response.error}`);
        setInventoryCount(0);
        setSquareEnvironment(healthCheck.environment || 'Error');
      } else {
        setConnectionStatus('success');
        setTestResult(`Successfully connected! Found ${response.totalItems || response.wines?.length || 0} available wines.`);
        setInventoryCount(response.totalItems || response.wines?.length || 0);
        setSquareEnvironment(healthCheck.environment || 'Connected');
      }
    } catch (error) {
      setConnectionStatus('error');
      setTestResult(`Connection test failed: ${error.message}`);
      setInventoryCount(0);
      setSquareEnvironment('Error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  useEffect(() => {
    testSquareConnection();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1>Square Integration Setup</h1>
        <p className="text-muted-foreground">
          Configure your Square integration to access live wine inventory
        </p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wine className="h-5 w-5" />
            Connection Status
          </CardTitle>
          <CardDescription>
            Current status of your Square API connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {connectionStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {connectionStatus === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
              {connectionStatus === 'idle' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
              <span className="font-medium">
                {connectionStatus === 'success' && 'Connected'}
                {connectionStatus === 'error' && 'Not Connected'}
                {connectionStatus === 'idle' && 'Testing...'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => window.open(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/make-server-9d538b9c/square/diagnostic`, '_blank')}
                variant="ghost"
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Diagnostics
              </Button>
              <Button 
                onClick={testSquareConnection} 
                disabled={isTestingConnection}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isTestingConnection ? 'animate-spin' : ''}`} />
                Test Connection
              </Button>
            </div>
          </div>

          {testResult && (
            <Alert className={connectionStatus === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertDescription>{testResult}</AlertDescription>
            </Alert>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-mono">
                {inventoryCount !== null ? inventoryCount : '--'}
              </div>
              <div className="text-sm text-muted-foreground">Available Wines</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-lg">
                <Badge variant={connectionStatus === 'success' ? 'default' : 'secondary'}>
                  {squareEnvironment}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">Environment</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Help */}
      {connectionStatus === 'error' && (
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>
              Follow these steps to configure your Square integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Get Square Credentials</h4>
              <p className="text-sm text-muted-foreground">
                Visit your Square Developer Dashboard to get your API credentials:
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="https://developer.squareup.com/apps" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Square Developer Dashboard
                </a>
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">2. Add Environment Variables</h4>
              <p className="text-sm text-muted-foreground">
                Add these to your <code>.env.local</code> file:
              </p>
              <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                <div>SQUARE_ACCESS_TOKEN=your_access_token_here</div>
                <div>SQUARE_APPLICATION_ID=your_app_id_here</div>
                <div>SQUARE_LOCATION_ID=your_location_id_here</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">3. Restart Application</h4>
              <p className="text-sm text-muted-foreground">
                Restart your development server to load the new environment variables.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {connectionStatus === 'success' && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.href = '#inventory'}>
                View Inventory
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '#dashboard'}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}