import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { 
  Code, 
  Copy, 
  Eye, 
  Settings, 
  Palette, 
  Upload,
  ExternalLink,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { EmbeddableSignup } from "./EmbeddableSignup";

const KING_FROSCH_ID = "550e8400-e29b-41d4-a716-446655440000";

interface EmbedConfig {
  wineClubId: string;
  clubName: string;
  clubLogo?: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  apiBaseUrl: string;
  embedCode: string;
}

export function EmbeddableSignupPage() {
  const [activeTab, setActiveTab] = useState("preview");
  const [embedConfig, setEmbedConfig] = useState<EmbedConfig>({
    wineClubId: KING_FROSCH_ID,
    clubName: "King Frosch Wine Club",
    clubLogo: "",
    primaryColor: "#d97706",
    backgroundColor: "#fef3c7", 
    textColor: "#1f2937",
    apiBaseUrl: "https://your-api-domain.com",
    embedCode: ""
  });

  const [copied, setCopied] = useState(false);

  // Generate embed code
  const generateEmbedCode = () => {
    const embedCode = `
<!-- King Frosch Wine Club Signup Form -->
<div id="wine-club-signup-${embedConfig.wineClubId}"></div>
<script>
  (function() {
    // Configuration
    const config = {
      wineClubId: '${embedConfig.wineClubId}',
      clubName: '${embedConfig.clubName}',
      clubLogo: '${embedConfig.clubLogo || ''}',
      primaryColor: '${embedConfig.primaryColor}',
      backgroundColor: '${embedConfig.backgroundColor}',
      textColor: '${embedConfig.textColor}',
      apiBaseUrl: '${embedConfig.apiBaseUrl}'
    };
    
    // Load the signup form
    const script = document.createElement('script');
    script.src = '${embedConfig.apiBaseUrl}/embeddable-signup.js';
    script.onload = function() {
      window.initWineClubSignup('${embedConfig.wineClubId}', config);
    };
    document.head.appendChild(script);
    
    // Fallback styles
    const style = document.createElement('style');
    style.textContent = \`
      #wine-club-signup-${embedConfig.wineClubId} {
        min-height: 100vh;
        background-color: ${embedConfig.backgroundColor};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
    \`;
    document.head.appendChild(style);
  })();
</script>
<!-- End Wine Club Signup Form -->`;

    setEmbedConfig(prev => ({ ...prev, embedCode }));
  };

  const copyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(embedConfig.embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const copyIframeCode = async () => {
    const iframeCode = `<iframe src="${embedConfig.apiBaseUrl}/signup/${embedConfig.wineClubId}" width="100%" height="800" frameborder="0" style="border-radius: 8px;"></iframe>`;
    
    try {
      await navigator.clipboard.writeText(iframeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  useEffect(() => {
    generateEmbedCode();
  }, [embedConfig.wineClubId, embedConfig.clubName, embedConfig.clubLogo, embedConfig.primaryColor, embedConfig.backgroundColor, embedConfig.textColor, embedConfig.apiBaseUrl]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Embeddable Signup Form</h1>
          <p className="text-muted-foreground">
            Create and customize embeddable signup forms for your website.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            Embeddable
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="embed">Embed Code</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-6">
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
              <div className="border rounded-lg overflow-hidden" style={{ height: '800px' }}>
                <EmbeddableSignup
                  wineClubId={embedConfig.wineClubId}
                  clubName={embedConfig.clubName}
                  clubLogo={embedConfig.clubLogo}
                  primaryColor={embedConfig.primaryColor}
                  backgroundColor={embedConfig.backgroundColor}
                  textColor={embedConfig.textColor}
                  apiBaseUrl={embedConfig.apiBaseUrl}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customize" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Basic Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="club-name">Club Name</Label>
                  <Input
                    id="club-name"
                    value={embedConfig.clubName}
                    onChange={(e) => setEmbedConfig(prev => ({ ...prev, clubName: e.target.value }))}
                    placeholder="Your Wine Club Name"
                  />
                </div>

                <div>
                  <Label htmlFor="club-logo">Club Logo URL</Label>
                  <Input
                    id="club-logo"
                    value={embedConfig.clubLogo}
                    onChange={(e) => setEmbedConfig(prev => ({ ...prev, clubLogo: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Max height: 300px, will be centered
                  </p>
                </div>

                <div>
                  <Label htmlFor="api-url">API Base URL</Label>
                  <Input
                    id="api-url"
                    value={embedConfig.apiBaseUrl}
                    onChange={(e) => setEmbedConfig(prev => ({ ...prev, apiBaseUrl: e.target.value }))}
                    placeholder="https://your-api-domain.com"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Your API endpoint for form submissions
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Color Customization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Customization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      value={embedConfig.primaryColor}
                      onChange={(e) => setEmbedConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#d97706"
                    />
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: embedConfig.primaryColor }}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="background-color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="background-color"
                      value={embedConfig.backgroundColor}
                      onChange={(e) => setEmbedConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      placeholder="#fef3c7"
                    />
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: embedConfig.backgroundColor }}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="text-color"
                      value={embedConfig.textColor}
                      onChange={(e) => setEmbedConfig(prev => ({ ...prev, textColor: e.target.value }))}
                      placeholder="#1f2937"
                    />
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: embedConfig.textColor }}
                    />
                  </div>
                </div>

                {/* Preset Color Schemes */}
                <div>
                  <Label>Preset Color Schemes</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      { name: "Wine Red", primary: "#dc2626", background: "#fef2f2", text: "#1f2937" },
                      { name: "Gold", primary: "#d97706", background: "#fef3c7", text: "#1f2937" },
                      { name: "Purple", primary: "#7c3aed", background: "#f3e8ff", text: "#1f2937" },
                      { name: "Green", primary: "#059669", background: "#ecfdf5", text: "#1f2937" }
                    ].map((scheme) => (
                      <Button
                        key={scheme.name}
                        variant="outline"
                        size="sm"
                        onClick={() => setEmbedConfig(prev => ({
                          ...prev,
                          primaryColor: scheme.primary,
                          backgroundColor: scheme.background,
                          textColor: scheme.text
                        }))}
                        className="justify-start"
                      >
                        <div className="flex gap-1 mr-2">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: scheme.primary }} />
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: scheme.background }} />
                        </div>
                        {scheme.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Current Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Club Name:</span>
                      <span className="font-medium">{embedConfig.clubName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Primary Color:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: embedConfig.primaryColor }} />
                        <span className="font-medium">{embedConfig.primaryColor}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Background:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: embedConfig.backgroundColor }} />
                        <span className="font-medium">{embedConfig.backgroundColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Multi-step signup process
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Plan selection with flip cards
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Wine preference selection
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Personal information collection
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Responsive design
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embed" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* JavaScript Embed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  JavaScript Embed (Recommended)
                </CardTitle>
                <CardDescription>
                  Full-featured embed with custom styling and interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Embed Code</Label>
                  <Textarea
                    value={embedConfig.embedCode}
                    onChange={(e) => setEmbedConfig(prev => ({ ...prev, embedCode: e.target.value }))}
                    className="font-mono text-sm"
                    rows={15}
                  />
                </div>
                <Button onClick={copyEmbedCode} className="w-full">
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Embed Code
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Iframe Embed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Iframe Embed (Simple)
                </CardTitle>
                <CardDescription>
                  Simple iframe embed for basic integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Iframe Code</Label>
                  <Textarea
                    value={`<iframe src="${embedConfig.apiBaseUrl}/signup/${embedConfig.wineClubId}" width="100%" height="800" frameborder="0" style="border-radius: 8px;"></iframe>`}
                    className="font-mono text-sm"
                    rows={3}
                    readOnly
                  />
                </div>
                <Button onClick={copyIframeCode} className="w-full">
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Iframe Code
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Integration Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Integration Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">JavaScript Embed (Recommended)</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Copy the JavaScript embed code above</li>
                  <li>Paste it into your website's HTML where you want the signup form to appear</li>
                  <li>The form will automatically load and initialize</li>
                  <li>Custom styling will be applied based on your configuration</li>
                </ol>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Iframe Embed (Simple)</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Copy the iframe code above</li>
                  <li>Paste it into your website's HTML</li>
                  <li>The form will load in an iframe</li>
                  <li>Limited customization options</li>
                </ol>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Make sure your API base URL is correctly configured and accessible from your website's domain.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}