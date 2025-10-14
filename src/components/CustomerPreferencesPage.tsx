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

interface GlobalPreference {
  id: string;
  name: string;
  description: string;
  categories: string[]; // Categories assigned by wine owner
  created_at: string;
  updated_at: string;
}

interface CustomerPreferenceAssignment {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  preference_type: 'global_preference' | 'custom_wines';
  global_preference_id?: string; // Reference to GlobalPreference
  custom_wine_ids?: string[]; // Specific Square wine IDs
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Wine categories are dynamically loaded from Square inventory
// No hardcoded categories - pulled live from Square catalog

// Sample preferences data - in production this would come from KV store
const samplePreferences: CustomerPreference[] = [];

export function CustomerPreferencesPage() {
  const [activeTab, setActiveTab] = useState("global-preferences");
  const [globalPreferences, setGlobalPreferences] = useState<GlobalPreference[]>([]);
  const [customerAssignments, setCustomerAssignments] = useState<CustomerPreferenceAssignment[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [squareCustomers, setSquareCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Create global preference modal state
  const [isCreateGlobalModalOpen, setIsCreateGlobalModalOpen] = useState(false);
  const [newGlobalPreference, setNewGlobalPreference] = useState<Partial<GlobalPreference>>({
    name: "",
    description: "",
    categories: []
  });

  // Create customer assignment modal state
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState<Partial<CustomerPreferenceAssignment>>({
    customer_id: "",
    customer_name: "",
    customer_email: "",
    preference_type: 'global_preference',
    global_preference_id: "",
    custom_wine_ids: [],
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

  const handleCreateGlobalPreference = async () => {
    try {
      const preferenceData = {
        wine_club_id: KING_FROSCH_ID,
        name: newGlobalPreference.name!,
        description: newGlobalPreference.description!,
        categories: newGlobalPreference.categories || []
      };

      // Call API to create global preference
      const response = await api.createGlobalPreference(preferenceData);
      
      if (response.preference) {
        setGlobalPreferences([...globalPreferences, response.preference]);
        setIsCreateGlobalModalOpen(false);
        setNewGlobalPreference({
          name: "",
          description: "",
          categories: []
        });
      } else {
        // Fallback for demo
        const newPreference: GlobalPreference = {
          id: `pref_${Date.now()}`,
          name: preferenceData.name,
          description: preferenceData.description,
          categories: preferenceData.categories,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setGlobalPreferences([...globalPreferences, newPreference]);
        setIsCreateGlobalModalOpen(false);
        setNewGlobalPreference({
          name: "",
          description: "",
          categories: []
        });
      }
    } catch (error) {
      console.error('Failed to create global preference:', error);
      // Still create locally for demo purposes
      const newPreference: GlobalPreference = {
        id: `pref_${Date.now()}`,
        name: newGlobalPreference.name!,
        description: newGlobalPreference.description!,
        categories: newGlobalPreference.categories || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setGlobalPreferences([...globalPreferences, newPreference]);
      setIsCreateGlobalModalOpen(false);
      setNewGlobalPreference({
        name: "",
        description: "",
        categories: []
      });
    }
  };

  const handleCreateCustomerAssignment = async () => {
    try {
      const assignmentData = {
        wine_club_id: KING_FROSCH_ID,
        customer_id: newAssignment.customer_id!,
        customer_name: newAssignment.customer_name!,
        customer_email: newAssignment.customer_email!,
        preference_type: newAssignment.preference_type!,
        global_preference_id: newAssignment.global_preference_id,
        custom_wine_ids: newAssignment.custom_wine_ids,
        notes: newAssignment.notes
      };

      // Call API to create customer assignment
      const response = await api.createCustomerAssignment(assignmentData);
      
      if (response.assignment) {
        setCustomerAssignments([...customerAssignments, response.assignment]);
        setIsCreateAssignmentModalOpen(false);
        setNewAssignment({
          customer_id: "",
          customer_name: "",
          customer_email: "",
          preference_type: 'global_preference',
          global_preference_id: "",
          custom_wine_ids: [],
          notes: ""
        });
      } else {
        // Fallback for demo
        const newAssignmentObj: CustomerPreferenceAssignment = {
          id: `assign_${Date.now()}`,
          customer_id: assignmentData.customer_id,
          customer_name: assignmentData.customer_name,
          customer_email: assignmentData.customer_email,
          preference_type: assignmentData.preference_type,
          global_preference_id: assignmentData.global_preference_id,
          custom_wine_ids: assignmentData.custom_wine_ids,
          notes: assignmentData.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setCustomerAssignments([...customerAssignments, newAssignmentObj]);
        setIsCreateAssignmentModalOpen(false);
        setNewAssignment({
          customer_id: "",
          customer_name: "",
          customer_email: "",
          preference_type: 'global_preference',
          global_preference_id: "",
          custom_wine_ids: [],
          notes: ""
        });
      }
    } catch (error) {
      console.error('Failed to create customer assignment:', error);
      // Still create locally for demo purposes
      const newAssignmentObj: CustomerPreferenceAssignment = {
        id: `assign_${Date.now()}`,
        customer_id: newAssignment.customer_id!,
        customer_name: newAssignment.customer_name!,
        customer_email: newAssignment.customer_email!,
        preference_type: newAssignment.preference_type!,
        global_preference_id: newAssignment.global_preference_id,
        custom_wine_ids: newAssignment.custom_wine_ids,
        notes: newAssignment.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setCustomerAssignments([...customerAssignments, newAssignmentObj]);
      setIsCreateAssignmentModalOpen(false);
      setNewAssignment({
        customer_id: "",
        customer_name: "",
        customer_email: "",
        preference_type: 'global_preference',
        global_preference_id: "",
        custom_wine_ids: [],
        notes: ""
      });
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global-preferences">Global Preferences</TabsTrigger>
          <TabsTrigger value="customer-assignments">Customer Assignments</TabsTrigger>
          <TabsTrigger value="categories">Available Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="global-preferences" className="space-y-6">
          {/* Global Preferences Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Global Preferences</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{globalPreferences.length}</div>
                <p className="text-xs text-muted-foreground">
                  Preferences customers can choose from
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Customer Assignments</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{customerAssignments.length}</div>
                <p className="text-xs text-muted-foreground">
                  Customers with assigned preferences
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Custom Wine Assignments</CardTitle>
                <Wine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  {customerAssignments.filter(a => a.preference_type === 'custom_wines').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Customers with specific wine assignments
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Global Preferences</CardTitle>
                <CardDescription>
                  Create preferences that customers can choose from during signup. Assign categories from your wine collection to each preference.
                </CardDescription>
              </div>
              <Dialog open={isCreateGlobalModalOpen} onOpenChange={setIsCreateGlobalModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Global Preference
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Global Preference</DialogTitle>
                    <DialogDescription>
                      Define a preference that customers can choose from during signup.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="preference-name">Preference Name</Label>
                      <Input
                        id="preference-name"
                        value={newGlobalPreference.name || ""}
                        onChange={(e) => setNewGlobalPreference({...newGlobalPreference, name: e.target.value})}
                        placeholder="e.g., Dry Red Wines, Sweet White Wines"
                      />
                    </div>

                    <div>
                      <Label htmlFor="preference-description">Description</Label>
                      <Input
                        id="preference-description"
                        value={newGlobalPreference.description || ""}
                        onChange={(e) => setNewGlobalPreference({...newGlobalPreference, description: e.target.value})}
                        placeholder="Brief description of this preference"
                      />
                    </div>

                    <div>
                      <Label>Assign Categories from Your Collection</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select which categories from your Square inventory should be included in this preference.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto border rounded-lg p-4">
                        {availableCategories.map((category) => (
                          <label key={category} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newGlobalPreference.categories?.includes(category) || false}
                              onChange={(e) => {
                                const categories = newGlobalPreference.categories || [];
                                if (e.target.checked) {
                                  setNewGlobalPreference({
                                    ...newGlobalPreference,
                                    categories: [...categories, category]
                                  });
                                } else {
                                  setNewGlobalPreference({
                                    ...newGlobalPreference,
                                    categories: categories.filter(c => c !== category)
                                  });
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateGlobalModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreateGlobalPreference} 
                        disabled={!newGlobalPreference.name || !newGlobalPreference.description || !newGlobalPreference.categories?.length}
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
                    <TableHead>Preference Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Customer Count</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {globalPreferences.map((preference) => {
                    const customerCount = customerAssignments.filter(a => a.global_preference_id === preference.id).length;
                    
                    return (
                      <TableRow key={preference.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{preference.name}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {preference.description}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {preference.categories.map((category, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs mr-1">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {customerCount}
                          </div>
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

        <TabsContent value="customer-assignments" className="space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Customer Assignments</CardTitle>
                <CardDescription>
                  Assign customers to global preferences or give them custom wine assignments for every shipment.
                </CardDescription>
              </div>
              <Dialog open={isCreateAssignmentModalOpen} onOpenChange={setIsCreateAssignmentModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Customer
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Assign Customer Preference</DialogTitle>
                    <DialogDescription>
                      Assign a customer to a global preference or give them custom wine assignments.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="assignment-customer-name">Customer Name</Label>
                        <Input
                          id="assignment-customer-name"
                          value={newAssignment.customer_name || ""}
                          onChange={(e) => setNewAssignment({...newAssignment, customer_name: e.target.value})}
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <Label htmlFor="assignment-customer-email">Customer Email</Label>
                        <Input
                          id="assignment-customer-email"
                          type="email"
                          value={newAssignment.customer_email || ""}
                          onChange={(e) => setNewAssignment({...newAssignment, customer_email: e.target.value})}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="assignment-type">Assignment Type</Label>
                      <Select 
                        value={newAssignment.preference_type || "global_preference"} 
                        onValueChange={(value: 'global_preference' | 'custom_wines') => setNewAssignment({...newAssignment, preference_type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="global_preference">Global Preference (Customer chooses from your defined preferences)</SelectItem>
                          <SelectItem value="custom_wines">Custom Wine Assignment (You assign specific wines for every shipment)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newAssignment.preference_type === 'global_preference' && (
                      <div>
                        <Label htmlFor="global-preference-select">Select Global Preference</Label>
                        <Select 
                          value={newAssignment.global_preference_id || ""} 
                          onValueChange={(value) => setNewAssignment({...newAssignment, global_preference_id: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a global preference" />
                          </SelectTrigger>
                          <SelectContent>
                            {globalPreferences.map(pref => (
                              <SelectItem key={pref.id} value={pref.id}>
                                {pref.name} - {pref.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground mt-1">
                          Customer will receive wines from the categories assigned to this preference.
                        </p>
                      </div>
                    )}

                    {newAssignment.preference_type === 'custom_wines' && (
                      <div>
                        <Label htmlFor="custom-wine-instructions">Custom Wine Assignment Instructions</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          For custom wine assignments, you'll manage specific wines in the Shipment Builder. 
                          This customer will receive wines you specifically assign to them for each shipment.
                        </p>
                        <Input
                          id="custom-wine-instructions"
                          value={newAssignment.notes || ""}
                          onChange={(e) => setNewAssignment({...newAssignment, notes: e.target.value})}
                          placeholder="Special instructions for custom wine selection..."
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="assignment-notes">Notes (Optional)</Label>
                      <Input
                        id="assignment-notes"
                        value={newAssignment.notes || ""}
                        onChange={(e) => setNewAssignment({...newAssignment, notes: e.target.value})}
                        placeholder="Additional notes about this customer assignment..."
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateAssignmentModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreateCustomerAssignment} 
                        disabled={!newAssignment.customer_name || !newAssignment.customer_email || 
                          (newAssignment.preference_type === 'global_preference' && !newAssignment.global_preference_id)}
                      >
                        Create Assignment
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
                    <TableHead>Assignment Type</TableHead>
                    <TableHead>Preference/Assignment</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerAssignments.map((assignment) => {
                    const globalPref = globalPreferences.find(p => p.id === assignment.global_preference_id);
                    
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{assignment.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{assignment.customer_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={assignment.preference_type === 'custom_wines' ? 'default' : 'outline'}>
                            {assignment.preference_type === 'custom_wines' ? 'Custom Wines' : 'Global Preference'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {assignment.preference_type === 'global_preference' ? (
                            <div>
                              <p className="font-medium">{globalPref?.name || 'Unknown Preference'}</p>
                              <p className="text-sm text-muted-foreground">{globalPref?.description}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {globalPref?.categories.map((category, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Custom wine assignment</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {assignment.notes || "No notes"}
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