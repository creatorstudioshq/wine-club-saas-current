import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Skeleton } from "./ui/skeleton";
import { CalendarIcon, Wine, Plus, Minus, Eye, Send, RefreshCw, Users, Package, Calendar as CalendarDays, Mail, Check, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { api } from "../utils/api";
import { format } from "date-fns";

const KING_FROSCH_ID = "550e8400-e29b-41d4-a716-446655440000";

interface CustomerPreference {
  id: string;
  customer_name: string;
  customer_email: string;
  preference_type: 'category_based' | 'custom';
  category_preferences: { category: string; quantity: number; }[];
  custom_wine_assignments?: string[];
  notes?: string;
}

interface WineAssignment {
  preference_id: string;
  customer_name: string;
  assigned_wines: { wine_id: string; wine_name: string; category: string; }[];
  status: 'pending' | 'assigned' | 'confirmed';
}

interface ClubShipment {
  id: string;
  name: string;
  shipment_date: string;
  ship_date: string;
  status: 'draft' | 'assigned' | 'confirmed' | 'shipped';
  wine_assignments: WineAssignment[];
  notes?: string;
  created_at: string;
}

// Sample customer preferences data - in production loaded from KV store
const samplePreferences: CustomerPreference[] = [];

export function ShipmentBuilderPage() {
  const [activeTab, setActiveTab] = useState("builder");
  const [shipments, setShipments] = useState<ClubShipment[]>([]);
  const [preferences, setPreferences] = useState<CustomerPreference[]>(samplePreferences);
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // New shipment creation state
  const [isCreatingShipment, setIsCreatingShipment] = useState(false);
  const [newShipment, setNewShipment] = useState({
    name: "",
    shipment_date: null as Date | null,
    ship_date: null as Date | null,
    notes: ""
  });
  
  // Wine assignment state
  const [currentShipment, setCurrentShipment] = useState<ClubShipment | null>(null);
  const [wineAssignments, setWineAssignments] = useState<WineAssignment[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch live available wines from Square (no local storage)
      const inventoryRes = await api.getLiveInventory(KING_FROSCH_ID, 'all', 0).catch(() => ({ wines: [] }));
      setWines(inventoryRes.wines || []);
      
      // Load customer preferences from KV store (only IDs and mappings stored)
      try {
        const preferencesRes = await api.getCustomerPreferences(KING_FROSCH_ID);
        setPreferences(preferencesRes.preferences || samplePreferences);
      } catch (error) {
        console.info('Using sample preferences data (backend not yet configured)');
        setPreferences(samplePreferences);
      }
      
      // Load shipment history from KV store
      try {
        const shipmentsRes = await api.getClubShipments(KING_FROSCH_ID);
        setShipments(shipmentsRes.shipments || []);
      } catch (error) {
        console.info('Using empty shipments data (backend not yet configured)');
        setShipments([]);
      }
      
    } catch (error) {
      console.error('Failed to fetch shipment builder data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleCreateShipment = async () => {
    try {
      const shipmentData = {
        wine_club_id: KING_FROSCH_ID,
        name: newShipment.name,
        shipment_date: newShipment.shipment_date?.toISOString() || "",
        ship_date: newShipment.ship_date?.toISOString() || "",
        wine_assignments: [], // Will be populated during assignment
        notes: newShipment.notes
      };

      const response = await api.createClubShipment(shipmentData);
      
      if (response.shipment) {
        setShipments([response.shipment, ...shipments]);
        setCurrentShipment(response.shipment);
        
        // Initialize wine assignments based on customer preferences
        const assignments: WineAssignment[] = preferences.map(pref => ({
          preference_id: pref.id,
          customer_name: pref.customer_name,
          assigned_wines: [],
          status: 'pending'
        }));
        setWineAssignments(assignments);
        
        setIsCreatingShipment(false);
        setNewShipment({
          name: "",
          shipment_date: null,
          ship_date: null,
          notes: ""
        });
        setActiveTab("assign");
      }
    } catch (error) {
      console.error('Failed to create shipment:', error);
    }
  };

  const assignWineToCustomer = (assignmentIndex: number, wine: any, category: string) => {
    const updated = [...wineAssignments];
    const assignment = updated[assignmentIndex];
    
    // Check if Square item is already assigned
    if (!assignment.assigned_wines.find(w => w.wine_id === wine.square_item_id)) {
      assignment.assigned_wines.push({
        wine_id: wine.square_item_id, // Store Square item ID only
        wine_name: wine.name, // Display name (loaded live from Square)
        category: category
      });
      assignment.status = 'assigned';
      setWineAssignments(updated);
    }
  };

  const removeWineFromCustomer = (assignmentIndex: number, wineId: string) => {
    const updated = [...wineAssignments];
    const assignment = updated[assignmentIndex];
    
    assignment.assigned_wines = assignment.assigned_wines.filter(w => w.wine_id !== wineId);
    assignment.status = assignment.assigned_wines.length > 0 ? 'assigned' : 'pending';
    setWineAssignments(updated);
  };

  const confirmShipment = () => {
    if (currentShipment) {
      const updatedShipment = {
        ...currentShipment,
        status: 'confirmed' as const,
        wine_assignments: wineAssignments
      };
      
      setShipments(shipments.map(s => s.id === currentShipment.id ? updatedShipment : s));
      setCurrentShipment(updatedShipment);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate statistics
  const totalCustomers = preferences.length;
  const totalBottlesNeeded = preferences.reduce((sum, pref) => {
    if (pref.preference_type === 'category_based') {
      return sum + pref.category_preferences.reduce((catSum, cat) => catSum + cat.quantity, 0);
    }
    return sum + (pref.custom_wine_assignments?.length || 0);
  }, 0);
  const assignedBottles = wineAssignments.reduce((sum, assignment) => sum + assignment.assigned_wines.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Shipment Builder</h1>
          <p className="text-muted-foreground">
            Create and manage wine club shipments with customer preferences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Shipment Builder</TabsTrigger>
          <TabsTrigger value="assign">Wine Assignment</TabsTrigger>
          <TabsTrigger value="history">Shipment History</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{totalCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  Active preferences
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Bottles Needed</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{totalBottlesNeeded}</div>
                <p className="text-xs text-muted-foreground">
                  Next shipment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Available Wines</CardTitle>
                <Wine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{wines.length}</div>
                <p className="text-xs text-muted-foreground">
                  In inventory
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Bottles Assigned</CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{assignedBottles}</div>
                <p className="text-xs text-muted-foreground">
                  {totalBottlesNeeded > 0 ? `${((assignedBottles / totalBottlesNeeded) * 100).toFixed(0)}% complete` : 'No assignment needed'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Customer Preferences Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Preferences Summary</CardTitle>
              <CardDescription>
                Overview of customer wine preferences for the next shipment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requirements</TableHead>
                    <TableHead>Total Bottles</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preferences.map((preference) => {
                    const totalBottles = preference.preference_type === 'category_based' 
                      ? preference.category_preferences.reduce((sum, cat) => sum + cat.quantity, 0)
                      : preference.custom_wine_assignments?.length || 0;

                    return (
                      <TableRow key={preference.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{preference.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{preference.customer_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={preference.preference_type === 'custom' ? 'default' : 'outline'}>
                            {preference.preference_type === 'custom' ? 'Custom' : 'Category'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {preference.preference_type === 'category_based' ? (
                            <div className="space-y-1">
                              {preference.category_preferences.map((catPref, idx) => (
                                <div key={idx} className="text-sm">
                                  {catPref.quantity}x {catPref.category}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Custom assignment required</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Wine className="h-4 w-4 text-muted-foreground" />
                            {totalBottles}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {preference.notes || "No notes"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Create New Shipment */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Shipment</CardTitle>
              <CardDescription>
                Start a new wine club shipment by setting dates and selecting wines for customer preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isCreatingShipment ? (
                <Button onClick={() => setIsCreatingShipment(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Shipment
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shipment-name">Shipment Name</Label>
                    <Input
                      id="shipment-name"
                      value={newShipment.name}
                      onChange={(e) => setNewShipment({...newShipment, name: e.target.value})}
                      placeholder="e.g. March 2024 Wine Club Shipment"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Shipment Date (Assignment)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {newShipment.shipment_date ? format(newShipment.shipment_date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newShipment.shipment_date || undefined}
                            onSelect={(date) => setNewShipment({...newShipment, shipment_date: date || null})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Ship Date (Actual Shipping)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {newShipment.ship_date ? format(newShipment.ship_date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newShipment.ship_date || undefined}
                            onSelect={(date) => setNewShipment({...newShipment, ship_date: date || null})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="shipment-notes">Notes (Optional)</Label>
                    <Textarea
                      id="shipment-notes"
                      value={newShipment.notes}
                      onChange={(e) => setNewShipment({...newShipment, notes: e.target.value})}
                      placeholder="Additional notes about this shipment..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreateShipment} disabled={!newShipment.name || !newShipment.shipment_date || !newShipment.ship_date}>
                      Create Shipment
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreatingShipment(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assign" className="space-y-6">
          {currentShipment ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Wine Assignment - {currentShipment.name}</CardTitle>
                      <CardDescription>
                        Assign specific wines to each customer based on their preferences.
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={currentShipment.status === 'confirmed' ? 'default' : 'outline'}>
                        {currentShipment.status.charAt(0).toUpperCase() + currentShipment.status.slice(1)}
                      </Badge>
                      {currentShipment.status !== 'confirmed' && (
                        <Button onClick={confirmShipment} disabled={assignedBottles < totalBottlesNeeded}>
                          <Check className="h-4 w-4 mr-2" />
                          Confirm Shipment
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {wineAssignments.map((assignment, index) => {
                      const preference = preferences.find(p => p.id === assignment.preference_id);
                      if (!preference) return null;

                      return (
                        <div key={assignment.preference_id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-medium">{assignment.customer_name}</h4>
                              <div className="text-sm text-muted-foreground">
                                {preference.preference_type === 'category_based' ? (
                                  preference.category_preferences.map((catPref, idx) => (
                                    <span key={idx}>
                                      {catPref.quantity}x {catPref.category}
                                      {idx < preference.category_preferences.length - 1 ? ', ' : ''}
                                    </span>
                                  ))
                                ) : (
                                  'Custom assignment required'
                                )}
                              </div>
                            </div>
                            <Badge variant={assignment.status === 'assigned' ? 'default' : 'outline'}>
                              {assignment.status}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <Label>Assigned Wines ({assignment.assigned_wines.length} bottles)</Label>
                            {assignment.assigned_wines.length > 0 ? (
                              <div className="grid gap-2">
                                {assignment.assigned_wines.map((wine, wineIndex) => (
                                  <div key={wineIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div className="flex items-center gap-2">
                                      <Wine className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">{wine.wine_name}</span>
                                      <Badge variant="outline" className="text-xs">{wine.category}</Badge>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => removeWineFromCustomer(index, wine.wine_id)}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No wines assigned yet</p>
                            )}
                          </div>

                          {preference.preference_type === 'category_based' && (
                            <div className="mt-4">
                              <Label>Available Wines by Category</Label>
                              <div className="grid gap-2 mt-2">
                                {preference.category_preferences.map((catPref, catIndex) => (
                                  <div key={catIndex}>
                                    <h5 className="text-sm font-medium mb-2">{catPref.category} (Need {catPref.quantity})</h5>
                                    <div className="grid gap-1 max-h-48 overflow-y-auto">
                                      {wines
                                        .filter(wine => {
                                          // Match by category name or wine attributes (color, varietal, sweetness)
                                          const categoryLower = catPref.category.toLowerCase();
                                          const wineCategory = wine.category_name?.toLowerCase() || '';
                                          const wineColor = wine.color?.toLowerCase() || '';
                                          const wineSweetness = wine.sweetness?.toLowerCase() || '';
                                          
                                          return wineCategory.includes(categoryLower) ||
                                                 categoryLower.includes(wineColor) ||
                                                 categoryLower.includes(wineSweetness);
                                        })
                                        .slice(0, 15)
                                        .map((wine, wineIndex) => {
                                          const primaryVariation = wine.variations?.[0];
                                          const price = primaryVariation ? `${(primaryVariation.price / 100).toFixed(2)}` : 'N/A';
                                          const inventory = wine.total_inventory || 0;
                                          
                                          return (
                                            <Button
                                              key={wineIndex}
                                              variant="outline"
                                              size="sm"
                                              className="justify-start h-auto p-2"
                                              onClick={() => assignWineToCustomer(index, wine, catPref.category)}
                                              disabled={inventory === 0}
                                            >
                                              <div className="flex items-center gap-2 flex-1">
                                                {wine.image_url ? (
                                                  <img src={wine.image_url} alt={wine.name} className="h-8 w-8 rounded object-cover" />
                                                ) : (
                                                  <Wine className="h-4 w-4" />
                                                )}
                                                <div className="text-left flex-1">
                                                  <div className="text-sm line-clamp-1">{wine.name}</div>
                                                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                    <span>{price}</span>
                                                    <span>•</span>
                                                    <span>{inventory} in stock</span>
                                                    {wine.color && (
                                                      <>
                                                        <span>•</span>
                                                        <span>{wine.color}</span>
                                                      </>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </Button>
                                          );
                                        })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Shipment</h3>
                <p className="text-muted-foreground mb-4">
                  Create a new shipment in the Shipment Builder tab to start assigning wines.
                </p>
                <Button onClick={() => setActiveTab("builder")}>
                  Go to Shipment Builder
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipment History</CardTitle>
              <CardDescription>
                View and manage previous wine club shipments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shipments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment Name</TableHead>
                      <TableHead>Shipment Date</TableHead>
                      <TableHead>Ship Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Customers</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{shipment.name}</p>
                            {shipment.notes && (
                              <p className="text-sm text-muted-foreground">{shipment.notes}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {shipment.shipment_date ? format(new Date(shipment.shipment_date), "PPP") : "-"}
                        </TableCell>
                        <TableCell>
                          {shipment.ship_date ? format(new Date(shipment.ship_date), "PPP") : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={shipment.status === 'confirmed' ? 'default' : 'outline'}>
                            {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {shipment.wine_assignments?.length || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Shipments Yet</h3>
                  <p className="text-muted-foreground">
                    Create your first wine club shipment to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}