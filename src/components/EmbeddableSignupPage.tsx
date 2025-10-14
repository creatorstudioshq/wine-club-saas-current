import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { EmbeddableSignup } from "./EmbeddableSignup";
import { 
  Eye, 
  Code, 
  Copy, 
  Download,
  Palette,
  Image,
  Settings,
  ExternalLink
} from "lucide-react";

export function EmbeddableSignupPage() {
  const [clubName, setClubName] = useState("Wine Club");
  const [clubLogo, setClubLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#92400e");
  const [secondaryColor, setSecondaryColor] = useState("#fef3c7");
  const [embedCode, setEmbedCode] = useState("");

  const generateEmbedCode = () => {
    const code = `<!-- Wine Club Signup Form -->
<div id="wine-club-signup"></div>

<!-- Include the signup script -->
<script src="https://your-domain.com/wine-club-signup.js"></script>

<!-- Initialize with your settings -->
<script>
  window.WineClubSignup.init({
    containerId: 'wine-club-signup',
    clubName: '${clubName}',
    clubLogo: '${clubLogo || ''}',
    primaryColor: '${primaryColor}',
    secondaryColor: '${secondaryColor}',
    apiEndpoint: 'https://your-api.com/signup'
  });
</script>`;
    
    setEmbedCode(code);
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    // You could add a toast notification here
  };

  const downloadEmbedCode = () => {
    const blob = new Blob([embedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wine-club-signup.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-gray-900 mb-2">Embeddable Signup Form</h1>
          <p className="text-gray-600">
            Customize and embed your wine club signup form on any website
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  Customize your signup form appearance and branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Club Name */}
                <div>
                  <Label htmlFor="clubName">Club Name</Label>
                  <Input
                    id="clubName"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    placeholder="Your Wine Club Name"
                  />
                </div>

                {/* Club Logo */}
                <div>
                  <Label htmlFor="clubLogo">Club Logo URL</Label>
                  <Input
                    id="clubLogo"
                    value={clubLogo || ''}
                    onChange={(e) => setClubLogo(e.target.value || null)}
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Optional: Max height 300px, will be centered
                  </p>
                </div>

                {/* Primary Color */}
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#92400e"
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Secondary Color */}
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      placeholder="#fef3c7"
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Generate Embed Code */}
                <Button 
                  onClick={generateEmbedCode}
                  className="w-full"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Generate Embed Code
                </Button>
              </CardContent>
            </Card>

            {/* Embed Code */}
            {embedCode && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Embed Code
                  </CardTitle>
                  <CardDescription>
                    Copy this code to embed the signup form on your website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
                        <code>{embedCode}</code>
                      </pre>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={copyEmbedCode}
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Code
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={downloadEmbedCode}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download HTML
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  See how your signup form will look to customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 border-b">
                    Preview Mode
                  </div>
                  <div className="bg-white">
                    <EmbeddableSignup
                      clubName={clubName}
                      clubLogo={clubLogo}
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1. Add to Your Website</h4>
                  <p className="text-sm text-gray-600">
                    Copy the embed code and paste it into your website's HTML where you want the signup form to appear.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">2. Customize Appearance</h4>
                  <p className="text-sm text-gray-600">
                    Use the configuration options above to match your brand colors and add your club logo.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">3. Test Integration</h4>
                  <p className="text-sm text-gray-600">
                    Test the form on your website to ensure it works correctly and submits to your backend.
                  </p>
                </div>

                <Alert>
                  <ExternalLink className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pro Tip:</strong> The form is fully responsive and will work on desktop, tablet, and mobile devices.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

