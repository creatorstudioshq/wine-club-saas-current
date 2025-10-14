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

  // Fetch existing config on load
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await api.getSquareConfig(KING_FROSCH_ID);
        if (response.config) {
          setLocationId(response.config.square_location_id || "");
          setProductionKey(response.config.square_access_token || "");
        }
      } catch (error: any) {
        console.error("Error fetching config:", error);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.saveSquareConfig({
        wine_club_id: KING_FROSCH_ID,
        square_location_id: locationId,
        square_access_token: productionKey,
      });
    } catch (error: any) {
      console.error("Error saving config:", error);
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
            <Label htmlFor="productionKey">Production Secret Key</Label>
            <Input
              id="productionKey"
              type="password"
              value={productionKey}
              onChange={(e) => setProductionKey(e.target.value)}
              placeholder="EAAAl... (Production access token)"
            />
          </div>

          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Configuration"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
