import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { api } from "../utils/api";

const KING_FROSCH_ID = "550e8400-e29b-41d4-a716-446655440000";

export function SquareConfigPage() {
  const [locationId, setLocationId] = useState("");
  const [productionKey, setProductionKey] = useState("");
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
          setMessage("Configuration loaded successfully");
          setMessageType("success");
        } else {
          setMessage("No configuration found. Please enter your Square credentials.");
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

  const handleSave = async () => {
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
      
      setMessage(response.message || "Configuration saved successfully!");
      setMessageType("success");
      
      // Clear the form after successful save
      setTimeout(() => {
        setMessage("Configuration saved! You can now test the Square inventory connection.");
        setMessageType("info");
      }, 2000);
      
    } catch (error: any) {
      console.error("Error saving config:", error);
      setMessage("Error saving configuration: " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Square API Setup</CardTitle>
          <CardDescription>
            Configure Square API to pull wine inventory into the app.
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
              Your access token: EAAAl82tQ_PjQ6qhp6TcHQOFORmFqRWsDGpUCBNMY37GR3qTe5YZ2df86IsgZSne
            </p>
          </div>

          <Button onClick={handleSave} disabled={loading || !locationId.trim() || !productionKey.trim()}>
            {loading ? "Saving..." : "Save Configuration"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
