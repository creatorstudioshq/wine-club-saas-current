import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ChevronLeft, ChevronRight, CheckCircle, Wine } from "lucide-react";
import { api } from "../utils/api";

const KING_FROSCH_ID = "550e8400-e29b-41d4-a716-446655440000";

export function SquareConfigPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [locationId, setLocationId] = useState("");
  const [productionKey, setProductionKey] = useState("");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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
      const response = await api.saveSquareConfig({
        wine_club_id: KING_FROSCH_ID,
        square_location_id: locationId.trim(),
        square_access_token: productionKey.trim(),
        selected_categories: selectedCategories,
      });
      
      setMessage("Setup complete! You can now create customer preferences.");
      setMessageType("success");
      setCurrentStep(3);
      
    } catch (error: any) {
      console.error("Error saving categories:", error);
      setMessage("Error saving category selection: " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle>Wine Club Setup</CardTitle>
          <CardDescription>
            Set up your Square integration and configure wine categories for your club.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1 ? 'bg-primary text-white' : 'bg-muted'
                  }`}>
                    {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
                  </div>
                  <span className="text-sm font-medium">Square Credentials</span>
                </div>
                <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2 ? 'bg-primary text-white' : 'bg-muted'
                  }`}>
                    {currentStep > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
                  </div>
                  <span className="text-sm font-medium">Select Categories</span>
                </div>
                <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 3 ? 'bg-primary text-white' : 'bg-muted'
                  }`}>
                    {currentStep > 3 ? <CheckCircle className="w-4 h-4" /> : '3'}
                  </div>
                  <span className="text-sm font-medium">Complete</span>
                </div>
              </div>
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Square Credentials */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Square API Credentials</CardTitle>
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

      {/* Step 2: Category Selection */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Select Wine Categories</CardTitle>
            <CardDescription>
              Choose which wine categories you want to offer to your customers. These will be used to create customer preferences.
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

      {/* Step 3: Complete */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              Setup Complete!
            </CardTitle>
            <CardDescription>
              Your Square integration is configured and ready to use.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <Wine className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <h3 className="font-medium text-green-800">Ready to Create Customer Preferences</h3>
                  <p className="text-sm text-green-700 mt-1">
                    You can now go to the Preferences page to create global preferences using your selected categories.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Selected Categories</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedCategories.map((category) => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Next Steps</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Create global preferences</li>
                  <li>• Assign customers to preferences</li>
                  <li>• Build shipments</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
