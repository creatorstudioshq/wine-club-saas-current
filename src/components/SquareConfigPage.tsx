import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ChevronLeft, ChevronRight, CheckCircle, Wine, Settings, Package, Heart, Truck } from "lucide-react";
import { api } from "../utils/api";

const KING_FROSCH_ID = "550e8400-e29b-41d4-a716-446655440000";

export function SquareConfigPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isWizardComplete, setIsWizardComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("credentials");
  const [locationId, setLocationId] = useState("L8JQY7QJQJQJQ"); // Hardcoded King Frosch location ID
  const [productionKey, setProductionKey] = useState("EAAAEOxxxxxxxx"); // Hardcoded King Frosch access token
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [globalPreferences, setGlobalPreferences] = useState<Array<{id: string, name: string, categories: string[]}>>([]);
  const [newPreferenceName, setNewPreferenceName] = useState("");
  const [newPreferenceCategories, setNewPreferenceCategories] = useState<string[]>([]);
  const [availableWines, setAvailableWines] = useState<any[]>([]);
  const [excludedWines, setExcludedWines] = useState<string[]>([]);
  const [shippingZones, setShippingZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");

  // Fetch existing config on load
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await api.getSquareConfig(KING_FROSCH_ID);
        if (response.config) {
          setLocationId(response.config.square_location_id || "");
          setProductionKey(response.config.square_access_token || "");
          setSelectedCategories(response.config.selected_categories || []);
          
          // If we have credentials, try to load categories
          if (response.config.square_location_id && response.config.square_access_token) {
            await loadCategories();
            setCurrentStep(2); // Move to category selection
          }
          
          // Check if wizard is complete (has all required data)
          if (response.config.square_location_id && 
              response.config.square_access_token && 
              response.config.selected_categories && 
              response.config.selected_categories.length > 0) {
            setIsWizardComplete(true);
            setActiveTab("credentials"); // Start in tab mode
          }
          
          setMessage("Configuration loaded successfully");
          setMessageType("success");
        } else {
          setMessage("Welcome! Let's set up your Square integration.");
          setMessageType("info");
        }
      } catch (error: any) {
        console.error("Error fetching config:", error);
        setMessage("Error loading configuration: " + error.message);
        setMessageType("error");
      }
    };
    fetchConfig();
  }, []);

  const loadCategories = async () => {
    try {
      const inventoryRes = await api.getLiveInventory(KING_FROSCH_ID, 'all', 0);
      const categories = new Set<string>();
      
      // Get all categories (including zero inventory for selection)
      inventoryRes.wines?.forEach(wine => {
        if (wine.category_name && 
            wine.category_name.toLowerCase() !== 'uncategorized' &&
            wine.category_name.toLowerCase() !== 'uncat' &&
            wine.category_name.toLowerCase() !== 'misc' &&
            wine.category_name.toLowerCase() !== 'other') {
          categories.add(wine.category_name);
        }
        if (wine.varietal) categories.add(wine.varietal);
        if (wine.color) categories.add(wine.color);
        if (wine.sweetness) categories.add(wine.sweetness);
      });
      
      setAvailableCategories(Array.from(categories).sort());
    } catch (error) {
      console.error('Failed to load categories:', error);
      setMessage("Failed to load categories from Square");
      setMessageType("error");
    }
  };

  const handleSaveCredentials = async () => {
    if (!locationId.trim() || !productionKey.trim()) {
      setMessage("Please enter both Location ID and Access Token");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const response = await api.saveSquareConfig({
        wine_club_id: KING_FROSCH_ID,
        square_location_id: locationId.trim(),
        square_access_token: productionKey.trim(),
      });
      
      setMessage("Credentials saved! Loading categories...");
      setMessageType("success");
      
      // Load categories and move to step 2
      await loadCategories();
      setCurrentStep(2);
      
    } catch (error: any) {
      console.error("Error saving config:", error);
      setMessage("Error saving configuration: " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategories = async () => {
    if (selectedCategories.length === 0) {
      setMessage("Please select at least one category");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      // Only save categories, don't touch credentials
      const response = await api.saveSquareConfig({
        wine_club_id: KING_FROSCH_ID,
        square_location_id: locationId.trim(), // Keep existing
        square_access_token: productionKey.trim(), // Keep existing
        selected_categories: selectedCategories,
      });
      
      setMessage("Categories saved! You can now create customer preferences.");
      setMessageType("success");
      setIsWizardComplete(true);
      setActiveTab("preferences"); // Go to preferences tab, not credentials
      
    } catch (error: any) {
      console.error("Error saving categories:", error);
      setMessage("Error saving category selection: " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      console.log('Category toggled:', category, 'New selection:', newSelection);
      return newSelection;
    });
  };

  return (
    <div className="space-y-6">
      {!isWizardComplete ? (
        // Wizard Mode - Step by step
        <>
          {/* Progress Header */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Wine Club Setup</CardTitle>
              <CardDescription>
                Configure your entire wine club in one comprehensive setup wizard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= 1 ? 'bg-primary text-white' : 'bg-muted'
                      }`}>
                        {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
                      </div>
                      <span className="text-sm font-medium">API Credentials</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= 2 ? 'bg-primary text-white' : 'bg-muted'
                      }`}>
                        {currentStep > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
                      </div>
                      <span className="text-sm font-medium">Categories</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= 3 ? 'bg-primary text-white' : 'bg-muted'
                      }`}>
                        {currentStep > 3 ? <CheckCircle className="w-4 h-4" /> : '3'}
                      </div>
                      <span className="text-sm font-medium">Preferences</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${currentStep >= 4 ? 'text-primary' : 'text-muted-foreground'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= 4 ? 'bg-primary text-white' : 'bg-muted'
                      }`}>
                        {currentStep > 4 ? <CheckCircle className="w-4 h-4" /> : '4'}
                      </div>
                      <span className="text-sm font-medium">Inventory</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${currentStep >= 5 ? 'text-primary' : 'text-muted-foreground'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= 5 ? 'bg-primary text-white' : 'bg-muted'
                      }`}>
                        {currentStep > 5 ? <CheckCircle className="w-4 h-4" /> : '5'}
                      </div>
                      <span className="text-sm font-medium">Shipping</span>
                    </div>
                  </div>
                </div>
                <Progress value={(currentStep / 5) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Wizard Steps */}
          {/* Step 1: API Credentials */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 1: API Credentials</CardTitle>
                <CardDescription>
                  Enter your Square location ID and production access token to connect your inventory.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {message && (
                  <div className={`p-3 rounded-md ${
                    messageType === "success" ? "bg-green-50 text-green-800 border border-green-200" :
                    messageType === "error" ? "bg-red-50 text-red-800 border border-red-200" :
                    "bg-blue-50 text-blue-800 border border-blue-200"
                  }`}>
                    {message}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="locationId">Location ID</Label>
                  <Input
                    id="locationId"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    placeholder="L123..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productionKey">Production Access Token</Label>
                  <Input
                    id="productionKey"
                    type="password"
                    value={productionKey}
                    onChange={(e) => setProductionKey(e.target.value)}
                    placeholder="EAAAl... (Production access token)"
                  />
                  <p className="text-sm text-gray-600">
                    Enter your Square production access token (starts with EAAAl...)
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveCredentials} disabled={loading || !locationId.trim() || !productionKey.trim()}>
                    {loading ? "Saving..." : "Save & Continue"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Categories */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Wine Categories</CardTitle>
                <CardDescription>
                  Pick the categories that can be assigned to preference groups. Categories can be used in multiple preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {message && (
                  <div className={`p-3 rounded-md ${
                    messageType === "success" ? "bg-green-50 text-green-800 border border-green-200" :
                    messageType === "error" ? "bg-red-50 text-red-800 border border-red-200" :
                    "bg-blue-50 text-blue-800 border border-blue-200"
                  }`}>
                    {message}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={category} className="text-sm cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>

                {selectedCategories.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Selected categories:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((category) => (
                        <Badge key={category} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleSaveCategories} disabled={loading || selectedCategories.length === 0}>
                    {loading ? "Saving..." : "Complete Setup"}
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        // Tab Mode - All steps accessible
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                Wine Club Configuration
              </CardTitle>
              <CardDescription>
                Your wine club is set up! You can edit any configuration below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="credentials" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Credentials</span>
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Categories</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Preferences</span>
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center space-x-2">
                  <Wine className="w-4 h-4" />
                  <span>Inventory</span>
                </TabsTrigger>
                <TabsTrigger value="shipping" className="flex items-center space-x-2">
                  <Truck className="w-4 h-4" />
                  <span>Shipping</span>
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          {/* Tab Content */}
          <TabsContent value="credentials">
            <Card>
              <CardHeader>
                <CardTitle>API Credentials</CardTitle>
                <CardDescription>
                  Manage your Square API connection settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {message && (
                  <div className={`p-3 rounded-md ${
                    messageType === "success" ? "bg-green-50 text-green-800 border border-green-200" :
                    messageType === "error" ? "bg-red-50 text-red-800 border border-red-200" :
                    "bg-blue-50 text-blue-800 border border-blue-200"
                  }`}>
                    {message}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="locationId">Location ID</Label>
                  <Input
                    id="locationId"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    placeholder="L123..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productionKey">Production Access Token</Label>
                  <Input
                    id="productionKey"
                    type="password"
                    value={productionKey}
                    onChange={(e) => setProductionKey(e.target.value)}
                    placeholder="EAAAl... (Production access token)"
                  />
                </div>

                <Button onClick={handleSaveCredentials} disabled={loading || !locationId.trim() || !productionKey.trim()}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Wine Categories</CardTitle>
                <CardDescription>
                  Select which categories can be assigned to preference groups.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={category} className="text-sm cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>

                <Button onClick={handleSaveCategories} disabled={loading || selectedCategories.length === 0}>
                  {loading ? "Saving..." : "Save Categories"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Global Preferences</CardTitle>
                <CardDescription>
                  Create preference groups that customers can choose from.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Create New Preference */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">Create New Preference</h4>
                  <div className="space-y-2">
                    <Label htmlFor="preferenceName">Preference Name</Label>
                    <Input
                      id="preferenceName"
                      value={newPreferenceName}
                      onChange={(e) => setNewPreferenceName(e.target.value)}
                      placeholder="e.g., Dry Red Wines, Sweet White Wines"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Select Categories for This Preference</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`pref-${category}`}
                            checked={newPreferenceCategories.includes(category)}
                            onCheckedChange={() => {
                              if (newPreferenceCategories.includes(category)) {
                                setNewPreferenceCategories(prev => prev.filter(c => c !== category));
                              } else {
                                setNewPreferenceCategories(prev => [...prev, category]);
                              }
                            }}
                          />
                          <Label htmlFor={`pref-${category}`} className="text-sm cursor-pointer">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => {
                      if (newPreferenceName && newPreferenceCategories.length > 0) {
                        const newPref = {
                          id: `pref_${Date.now()}`,
                          name: newPreferenceName,
                          categories: newPreferenceCategories
                        };
                        setGlobalPreferences(prev => [...prev, newPref]);
                        setNewPreferenceName("");
                        setNewPreferenceCategories([]);
                        setMessage("Preference created successfully!");
                        setMessageType("success");
                      } else {
                        setMessage("Please enter a name and select at least one category");
                        setMessageType("error");
                      }
                    }}
                    disabled={!newPreferenceName || newPreferenceCategories.length === 0}
                  >
                    Add Preference
                  </Button>
                </div>

                {/* Existing Preferences */}
                {globalPreferences.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Created Preferences</h4>
                    <div className="space-y-2">
                      {globalPreferences.map((pref) => (
                        <div key={pref.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{pref.name}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {pref.categories.map((cat) => (
                                <Badge key={cat} variant="outline" className="text-xs">
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setGlobalPreferences(prev => prev.filter(p => p.id !== pref.id));
                              setMessage("Preference removed");
                              setMessageType("success");
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                  Exclude special items from customer shipments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Inventory exclusion coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Zones</CardTitle>
                <CardDescription>
                  Configure shipping zones and rates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Shipping zones coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
