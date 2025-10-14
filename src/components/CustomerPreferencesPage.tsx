import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Skeleton } from "./ui/skeleton";
import { Plus, Edit, Trash2, Wine, User, Settings, RefreshCw, UserCheck } from "lucide-react";
import { api } from "../utils/api";

const KING_FROSCH_ID = "550e8400-e29b-41d4-a716-446655440000";

interface CategoryPreference {
  category: string;
  quantity: number;
}

interface CustomerPreference {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  preference_type: 'category_based' | 'custom';
  category_preferences: CategoryPreference[];
  custom_wine_assignments?: string[]; // Wine IDs for custom assignments
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Wine categories are dynamically loaded from Square inventory
// No hardcoded categories - pulled live from Square catalog

// Sample preferences data - in production this would come from KV store
const samplePreferences: CustomerPreference[] = [];

export function CustomerPreferencesPage() {
  const [activeTab, setActiveTab] = useState("preferences");
  const [preferences, setPreferences] = useState<CustomerPreference[]>(samplePreferences);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [squareCustomers, setSquareCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Create preference modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPreference, setNewPreference] = useState<Partial<CustomerPreference>>({
    customer_id: "",
    customer_name: "",
    customer_email: "",
    preference_type: 'category_based',
    category_preferences: [],
    custom_wine_assignments: [],
    notes: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Load available categories from Square inventory
      const inventoryRes = await api.getLiveInventory(KING_FROSCH_ID, 'all', 0);
      const categories = new Set<string>();
      
      // Use the availableCategories from Square response
      if (inventoryRes.availableCategories) {
        inventoryRes.availableCategories.forEach(cat => {
          if (cat && typeof cat === 'string') {
            categories.add(cat);
          }
        });
      }
      
      // Also extract from individual wine category_name
      inventoryRes.wines?.forEach(wine => {
        if (wine.category_name) {
          categories.add(wine.category_name);
        }
        // Also try to extract from varietal/color/sweetness fields
        if (wine.varietal) categories.add(wine.varietal);
        if (wine.color) categories.add(wine.color);
        if (wine.sweetness) categories.add(wine.sweetness);
      });
      
      setAvailableCategories(Array.from(categories).sort());
      
      // Load customer preferences from KV store
      try {
        const preferencesRes = await api.getCustomerPreferences(KING_FROSCH_ID);
        setPreferences(preferencesRes.preferences || samplePreferences);
      } catch (error) {
        console.info('Using sample preferences data (backend not yet configured)');
        setPreferences(samplePreferences);
      }
      
      // TODO: Load Square customers
      // const customersRes = await api.getSquareCustomers(KING_FROSCH_ID);
      // setSquareCustomers(customersRes.customers || []);
      
    } catch (error) {
      console.error('Failed to fetch preference data:', error);
      // Fallback categories if Square fails
      setAvailableCategories([
        "Red Wine", "White Wine", "Rosé", "Sparkling", "Dessert Wine", "Port",
        "Cabernet Sauvignon", "Chardonnay", "Pinot Noir", "Sauvignon Blanc",
        "Merlot", "Riesling", "Syrah", "Pinot Grigio", "Malbec", "Zinfandel"
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const addCategoryPreference = () => {
    const newCatPref: CategoryPreference = { category: availableCategories[0], quantity: 1 };
    setNewPreference({
      ...newPreference,
      category_preferences: [...(newPreference.category_preferences || []), newCatPref]
    });
  };

  const updateCategoryPreference = (index: number, field: keyof CategoryPreference, value: string | number) => {
    const updated = [...(newPreference.category_preferences || [])];
    updated[index] = { ...updated[index], [field]: value };
    setNewPreference({
      ...newPreference,
      category_preferences: updated
    });
  };

  const removeCategoryPreference = (index: number) => {
    const updated = [...(newPreference.category_preferences || [])];
    updated.splice(index, 1);
    setNewPreference({
      ...newPreference,
      category_preferences: updated
    });
  };

  const handleCreatePreference = async () => {
    try {
      const preferenceData = {
        wine_club_id: KING_FROSCH_ID,
        customer_id: newPreference.customer_id!, // Square customer ID
        customer_name: newPreference.customer_name!,
        customer_email: newPreference.customer_email!,
        preference_type: newPreference.preference_type!,
        category_preferences: newPreference.category_preferences || [],
        custom_wine_assignments: newPreference.custom_wine_assignments, // Square item IDs
        notes: newPreference.notes
      };

      const response = await api.createCustomerPreference(preferenceData);
      
      if (response.preference) {
        setPreferences([...preferences, response.preference]);
        setIsCreateModalOpen(false);
        setNewPreference({
          customer_id: "",
          customer_name: "",
          customer_email: "",
          preference_type: 'category_based',
          category_preferences: [],
          custom_wine_assignments: [],
          notes: ""
        });
      }
    } catch (error) {
      console.error('Failed to create preference:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate stats
  const categoryStats = preferences.filter(p => p.preference_type === 'category_based').length;
  const customStats = preferences.filter(p => p.preference_type === 'custom').length;
  const totalBottlesRequested = preferences.reduce((sum, pref) => {
    if (pref.preference_type === 'category_based') {
      return sum + pref.category_preferences.reduce((catSum, cat) => catSum + cat.quantity, 0);
    }
    return sum + (pref.custom_wine_assignments?.length || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Custom Shipments</h1>
          <p className="text-muted-foreground">
            Manage customer wine preferences for subscription shipments.
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preferences">Custom Shipments</TabsTrigger>
          <TabsTrigger value="categories">Category Management</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-6">
          {/* Preferences Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Preferences</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{preferences.length}</div>
                <p className="text-xs text-muted-foreground">
                  Customer preferences set
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Category-Based</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{categoryStats}</div>
                <p className="text-xs text-muted-foreground">
                  Standard preferences
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Custom Assignments</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{customStats}</div>
                <p className="text-xs text-muted-foreground">
                  Specific wine assignments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Bottles</CardTitle>
                <Wine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{totalBottlesRequested}</div>
                <p className="text-xs text-muted-foreground">
                  Next shipment requirement
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Custom Shipments</CardTitle>
                <CardDescription>
                  Manage individual customer wine preferences and custom assignments.
                </CardDescription>
              </div>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Preference
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Customer Preference</DialogTitle>
                    <DialogDescription>
                      Set up wine preferences for a customer.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customer-name">Customer Name</Label>
                        <Input
                          id="customer-name"
                          value={newPreference.customer_name || ""}
                          onChange={(e) => setNewPreference({...newPreference, customer_name: e.target.value})}
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-email">Customer Email</Label>
                        <Input
                          id="customer-email"
                          type="email"
                          value={newPreference.customer_email || ""}
                          onChange={(e) => setNewPreference({...newPreference, customer_email: e.target.value})}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="preference-type">Preference Type</Label>
                      <Select 
                        value={newPreference.preference_type || "category_based"} 
                        onValueChange={(value: 'category_based' | 'custom') => setNewPreference({...newPreference, preference_type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="category_based">Category-Based (e.g., 3 Dry Red + 3 Sweet Red)</SelectItem>
                          <SelectItem value="custom">Custom Assignment (Specific wines chosen)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newPreference.preference_type === 'category_based' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Category Preferences</Label>
                          <Button type="button" variant="outline" size="sm" onClick={addCategoryPreference}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                          </Button>
                        </div>
                        {newPreference.category_preferences?.map((catPref, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="flex-1">
                              <Select 
                                value={catPref.category} 
                                onValueChange={(value) => updateCategoryPreference(index, 'category', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableCategories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="w-24">
                              <Input
                                type="number"
                                min="1"
                                max="12"
                                value={catPref.quantity}
                                onChange={(e) => updateCategoryPreference(index, 'quantity', parseInt(e.target.value) || 1)}
                                placeholder="Qty"
                              />
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeCategoryPreference(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {(newPreference.category_preferences?.length || 0) === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No category preferences added yet. Click "Add Category" to start.
                          </p>
                        )}
                      </div>
                    )}

                    {newPreference.preference_type === 'custom' && (
                      <div>
                        <Label htmlFor="custom-instructions">Custom Assignment Instructions</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Custom wine assignments will be managed in the Shipment Builder using specific Square item IDs.
                          No inventory data is stored locally - all wine details pulled live from Square.
                        </p>
                        <Input
                          id="custom-instructions"
                          value={newPreference.notes || ""}
                          onChange={(e) => setNewPreference({...newPreference, notes: e.target.value})}
                          placeholder="Special instructions for custom wine selection..."
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input
                        id="notes"
                        value={newPreference.notes || ""}
                        onChange={(e) => setNewPreference({...newPreference, notes: e.target.value})}
                        placeholder="Additional notes about customer preferences..."
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreatePreference} 
                        disabled={!newPreference.customer_name || !newPreference.customer_email}
                      >
                        Create Preference
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Preferences</TableHead>
                    <TableHead>Total Bottles</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
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
                            <span className="text-sm text-muted-foreground">Custom assignment</span>
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
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Categories</CardTitle>
              <CardDescription>
                Wine categories available for customer preference selection. These come from your Square inventory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableCategories.map((category) => {
                  const categoryUsage = preferences
                    .filter(p => p.preference_type === 'category_based')
                    .reduce((count, pref) => {
                      return count + pref.category_preferences.filter(cp => cp.category === category).length;
                    }, 0);

                  return (
                    <Card key={category}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{category}</h4>
                            <p className="text-sm text-muted-foreground">
                              {categoryUsage} customer{categoryUsage !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <Wine className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}