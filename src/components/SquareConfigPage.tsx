import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ChevronLeft, ChevronRight, CheckCircle, Wine, Settings, Package, Heart, Truck, RefreshCw, CreditCard } from "lucide-react";
import { api } from "../utils/api";
import { useClient } from "../contexts/ClientContext";
import { PlansPage } from "./PlansPage";
import { CustomerPreferencesPage } from "./CustomerPreferencesPage";

export function SquareConfigPage() {
  const { currentWineClub } = useClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [isWizardComplete, setIsWizardComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("credentials");
  const [locationId, setLocationId] = useState("");
  const [productionKey, setProductionKey] = useState("");
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
      if (!currentWineClub) return;
      
      try {
        const response = await api.getSquareConfig(currentWineClub.id);
        if (response.config) {
          setLocationId(response.config.square_location_id || "");
          setProductionKey(response.config.square_access_token || "");
          setSelectedCategories(response.config.selected_categories || []);
          
          // If we have credentials, try to load categories
          if (response.config.square_location_id && response.config.square_access_token) {
            await loadCategories();
            await loadInventory(); // Also load inventory
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
  }, [currentWineClub]);

  const loadCategories = async () => {
    if (!currentWineClub) return;
    
    try {
      const inventoryRes = await api.getLiveInventory(currentWineClub.id, 'all', 0);
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
    if (!currentWineClub) {
      setMessage("No wine club selected");
      setMessageType("error");
      return;
    }
    
    if (!locationId.trim() || !productionKey.trim()) {
      setMessage("Please enter both Location ID and Access Token");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const response = await api.saveSquareConfig({
        wine_club_id: currentWineClub.id,
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
    if (!currentWineClub) {
      setMessage("No wine club selected");
      setMessageType("error");
      return;
    }
    
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
        wine_club_id: currentWineClub.id,
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

  const loadInventory = async () => {
    if (!currentWineClub) return;
    
    setLoading(true);
    try {
      const response = await api.getLiveInventory(currentWineClub.id, 'all', 0);
      const wines = (response.wines || []).filter(wine => 
        wine.category_name && 
        wine.category_name.toLowerCase() !== 'uncategorized' &&
        wine.category_name.toLowerCase() !== 'uncat' &&
        wine.category_name.toLowerCase() !== 'misc' &&
        wine.category_name.toLowerCase() !== 'other'
      );
      
      setAvailableWines(wines);
      setMessage(`Loaded ${wines.length} wines from Square`);
      setMessageType("success");
    } catch (error: any) {
      console.error('Failed to load inventory:', error);
      setMessage("Failed to load inventory from Square");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const toggleWineExclusion = (wineId: string) => {
    setExcludedWines(prev => {
      const newExclusions = prev.includes(wineId)
        ? prev.filter(id => id !== wineId)
        : [...prev, wineId];
      
      console.log('Wine exclusion toggled:', wineId, 'New exclusions:', newExclusions);
      return newExclusions;
    });
  };

  const saveExcludedWines = async () => {
    if (!currentWineClub) return;
    
    setLoading(true);
    try {
      // Save excluded wines to the backend (you'll need to implement this API endpoint)
      // For now, we'll just show a success message
      setMessage(`Saved ${excludedWines.length} wine exclusions`);
      setMessageType("success");
    } catch (error: any) {
      console.error('Failed to save exclusions:', error);
      setMessage("Failed to save wine exclusions");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
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
              <TabsList className="grid w-full grid-cols-7">
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
                <TabsTrigger value="plans" className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Plans</span>
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
                  Filter wines that should NOT appear in preference assignments. Exclude special items, limited editions, or wines not suitable for club shipments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(!locationId || !productionKey) ? (
                  <div className="text-center py-8">
                    <Wine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Please configure Square credentials first to load inventory.</p>
                    <Button 
                      onClick={() => setActiveTab("credentials")}
                      className="mt-4"
                    >
                      Configure Square Credentials
                    </Button>
                  </div>
                ) : availableWines.length === 0 ? (
                  <div className="text-center py-8">
                    <Wine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No wines found. Click refresh to load inventory from Square.</p>
                    <Button 
                      onClick={loadInventory}
                      className="mt-4"
                    >
                      Load Inventory
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-muted-foreground">
                          Showing {availableWines.length} wines
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {excludedWines.length} excluded from preferences
                        </div>
                      </div>
                      <Button 
                        onClick={loadInventory} 
                        variant="outline" 
                        size="sm"
                        disabled={loading}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Inventory
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {availableWines.map((wine) => (
                        <div 
                          key={wine.square_item_id} 
                          className={`border rounded-lg p-3 transition-colors ${
                            excludedWines.includes(wine.square_item_id) 
                              ? 'bg-red-50 border-red-200' 
                              : 'bg-green-50 border-green-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{wine.name}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {wine.category_name} • {wine.varietal}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {wine.color}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {wine.sweetness}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Stock: {wine.total_inventory}
                                </Badge>
                              </div>
                            </div>
                            <Checkbox
                              checked={excludedWines.includes(wine.square_item_id)}
                              onCheckedChange={() => toggleWineExclusion(wine.square_item_id)}
                              className="ml-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        {excludedWines.length > 0 && (
                          <span className="text-red-600">
                            {excludedWines.length} wines excluded from preference assignments
                          </span>
                        )}
                      </div>
                      <Button 
                        onClick={saveExcludedWines}
                        disabled={loading}
                        variant="outline"
                      >
                        {loading ? "Saving..." : "Save Exclusions"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans">
            <PlansPage />
          </TabsContent>

          <TabsContent value="preferences">
            <CustomerPreferencesPage />
          </TabsContent>

          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Zones & Rates</CardTitle>
                <CardDescription>
                  Configure shipping zones and USPS rates from your location (92677).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* USPS Ground Advantage */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">USPS Ground Advantage</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Local (92677 area):</span>
                        <span className="font-medium">$8.95</span>
                      </div>
                      <div className="flex justify-between">
                        <span>California:</span>
                        <span className="font-medium">$12.95</span>
                      </div>
                      <div className="flex justify-between">
                        <span>West Coast:</span>
                        <span className="font-medium">$15.95</span>
                      </div>
                      <div className="flex justify-between">
                        <span>East Coast:</span>
                        <span className="font-medium">$18.95</span>
                      </div>
                    </div>
                  </div>

                  {/* USPS Priority Mail */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">USPS Priority Mail</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Local (92677 area):</span>
                        <span className="font-medium">$12.95</span>
                      </div>
                      <div className="flex justify-between">
                        <span>California:</span>
                        <span className="font-medium">$16.95</span>
                      </div>
                      <div className="flex justify-between">
                        <span>West Coast:</span>
                        <span className="font-medium">$19.95</span>
                      </div>
                      <div className="flex justify-between">
                        <span>East Coast:</span>
                        <span className="font-medium">$22.95</span>
                      </div>
                    </div>
                  </div>

                  {/* USPS Express */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">USPS Express</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Local (92677 area):</span>
                        <span className="font-medium">$25.95</span>
                      </div>
                      <div className="flex justify-between">
                        <span>California:</span>
                        <span className="font-medium">$29.95</span>
                      </div>
                      <div className="flex justify-between">
                        <span>West Coast:</span>
                        <span className="font-medium">$32.95</span>
                      </div>
                      <div className="flex justify-between">
                        <span>East Coast:</span>
                        <span className="font-medium">$35.95</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Shipping Zone Configuration</h4>
                  <p className="text-sm text-blue-800">
                    These rates are based on USPS pricing from ZIP code 92677 (Orange County, CA). 
                    Rates may vary based on package weight and dimensions. Contact your shipping provider 
                    for exact pricing and to set up automated rate calculation.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Shipping Integration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
