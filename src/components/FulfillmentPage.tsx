import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  RefreshCw, 
  Eye, 
  AlertTriangle,
  Plus,
  Minus,
  Search,
  Filter,
  Download
} from "lucide-react";
import { api } from "../utils/api";
import { useClient } from "../contexts/ClientContext";

interface SquareOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  order_date: string;
  total_amount: number;
  status: string;
  line_items: SquareLineItem[];
  created_at: string;
}

interface SquareLineItem {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  item_id: string;
  variation_id: string;
  category: string;
  in_stock: boolean;
}

interface PickedOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  picked_items: PickedItem[];
  picked_at: string;
  picked_by: string;
}

interface PickedItem {
  id: string;
  order_number: string;
  wine_name: string;
  quantity: number;
  box_number: number; // -1, -2, etc.
  picked_at: string;
}

interface ApprovedOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  approved_items: PickedItem[];
  approved_at: string;
  approved_by: string;
}

interface ShippedOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  shipped_items: PickedItem[];
  tracking_number: string;
  shipped_at: string;
  shipped_by: string;
}

export function FulfillmentPage() {
  const { currentWineClub } = useClient();
  const [activeTab, setActiveTab] = useState("orders");
  
  // Orders Tab
  const [orders, setOrders] = useState<SquareOrder[]>([]);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [lastShipmentDate, setLastShipmentDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  // Picked Tab
  const [pickedOrders, setPickedOrders] = useState<PickedOrder[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  // Approved Tab
  const [approvedOrders, setApprovedOrders] = useState<ApprovedOrder[]>([]);
  const [selectedApprovedOrders, setSelectedApprovedOrders] = useState<string[]>([]);
  
  // Shipped Tab
  const [shippedOrders, setShippedOrders] = useState<ShippedOrder[]>([]);

  const fetchOrders = async () => {
    if (!currentWineClub) return;
    
    try {
      setLoading(true);
      // This would call Square API to get orders since last shipment
      // For now, using mock data
      const mockOrders: SquareOrder[] = [
        {
          id: "order_1",
          order_number: "ORD-001",
          customer_name: "John Smith",
          customer_email: "john@example.com",
          order_date: "2025-01-15",
          total_amount: 89.00,
          status: "pending",
          line_items: [
            {
              id: "item_1",
              name: "Cabernet Sauvignon 2020",
              quantity: 3,
              unit_price: 29.67,
              total_price: 89.00,
              item_id: "wine_1",
              variation_id: "var_1",
              category: "Red Wine",
              in_stock: true
            }
          ],
          created_at: "2025-01-15T10:00:00Z"
        },
        {
          id: "order_2",
          order_number: "ORD-002",
          customer_name: "Sarah Johnson",
          customer_email: "sarah@example.com",
          order_date: "2025-01-16",
          total_amount: 178.00,
          status: "pending",
          line_items: [
            {
              id: "item_2",
              name: "Chardonnay 2021",
              quantity: 6,
              unit_price: 29.67,
              total_price: 178.00,
              item_id: "wine_2",
              variation_id: "var_2",
              category: "White Wine",
              in_stock: true
            }
          ],
          created_at: "2025-01-16T14:30:00Z"
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsPicked = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Group items by wine and create box numbers
    const pickedItems: PickedItem[] = [];
    let boxNumber = 1;
    
    order.line_items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        pickedItems.push({
          id: `${item.id}_${i}`,
          order_number: `${order.order_number}-${boxNumber}`,
          wine_name: item.name,
          quantity: 1,
          box_number: boxNumber,
          picked_at: new Date().toISOString(),
        });
        
        // Every 12 bottles = new box
        if ((i + 1) % 12 === 0) {
          boxNumber++;
        }
      }
    });

    const pickedOrder: PickedOrder = {
      id: orderId,
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      picked_items: pickedItems,
      picked_at: new Date().toISOString(),
      picked_by: "Current User" // Would be actual user
    };

    setPickedOrders([...pickedOrders, pickedOrder]);
    setOrders(orders.filter(o => o.id !== orderId));
  };

  const markAsNewItemNeeded = (orderId: string, itemId: string) => {
    // Mark item as needing new stock
    console.log('Marking item as new item needed:', orderId, itemId);
    // This would update the order to flag the item
  };

  const approveOrders = (orderIds: string[]) => {
    const ordersToApprove = pickedOrders.filter(o => orderIds.includes(o.id));
    
    const approvedOrdersList: ApprovedOrder[] = ordersToApprove.map(order => ({
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      approved_items: order.picked_items,
      approved_at: new Date().toISOString(),
      approved_by: "Current User"
    }));

    setApprovedOrders([...approvedOrders, ...approvedOrdersList]);
    setPickedOrders(pickedOrders.filter(o => !orderIds.includes(o.id)));
    setSelectedOrders([]);
  };

  const shipOrders = (orderIds: string[], trackingNumbers: { [key: string]: string }) => {
    const ordersToShip = approvedOrders.filter(o => orderIds.includes(o.id));
    
    const shippedOrdersList: ShippedOrder[] = ordersToShip.map(order => ({
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      shipped_items: order.approved_items,
      tracking_number: trackingNumbers[order.id] || "",
      shipped_at: new Date().toISOString(),
      shipped_by: "Current User"
    }));

    setShippedOrders([...shippedOrders, ...shippedOrdersList]);
    setApprovedOrders(approvedOrders.filter(o => !orderIds.includes(o.id)));
    setSelectedApprovedOrders([]);
  };

  useEffect(() => {
    fetchOrders();
  }, [currentWineClub, onlineOnly]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fulfillment</h2>
          <p className="text-muted-foreground">
            Manage order fulfillment from Square orders to shipping
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={onlineOnly}
              onCheckedChange={setOnlineOnly}
            />
            <Label>Online Only</Label>
          </div>
          <Button onClick={fetchOrders} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Orders
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="picked" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Picked</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Approved</span>
          </TabsTrigger>
          <TabsTrigger value="shipped" className="flex items-center space-x-2">
            <Truck className="w-4 h-4" />
            <span>Shipped</span>
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Square Orders</CardTitle>
              <CardDescription>
                Orders from Square since last shipment date: {lastShipmentDate || "No previous shipments"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
                  <p className="text-muted-foreground">
                    No orders found since the last shipment date.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{order.order_number}</h4>
                          <p className="text-sm text-muted-foreground">
                            {order.customer_name} • {order.customer_email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.order_date).toLocaleDateString()} • ${order.total_amount}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsPicked(order.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Picked
                          </Button>
                        </div>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Wine</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.line_items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.category}</Badge>
                              </TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>${item.total_price}</TableCell>
                              <TableCell>
                                <Badge variant={item.in_stock ? "default" : "destructive"}>
                                  {item.in_stock ? "In Stock" : "Out of Stock"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {!item.in_stock && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => markAsNewItemNeeded(order.id, item.id)}
                                  >
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    New Item Needed
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Picked Tab */}
        <TabsContent value="picked">
          <Card>
            <CardHeader>
              <CardTitle>Picked Orders</CardTitle>
              <CardDescription>
                Orders that have been picked and are ready for approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pickedOrders.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Picked Orders</h3>
                  <p className="text-muted-foreground">
                    No orders have been picked yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedOrders.length === pickedOrders.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedOrders(pickedOrders.map(o => o.id));
                          } else {
                            setSelectedOrders([]);
                          }
                        }}
                      />
                      <Label>Select All</Label>
                    </div>
                    <Button
                      onClick={() => approveOrders(selectedOrders)}
                      disabled={selectedOrders.length === 0}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Selected ({selectedOrders.length})
                    </Button>
                  </div>

                  {pickedOrders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedOrders([...selectedOrders, order.id]);
                              } else {
                                setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                              }
                            }}
                          />
                          <div>
                            <h4 className="font-medium">{order.order_number}</h4>
                            <p className="text-sm text-muted-foreground">
                              {order.customer_name} • {order.customer_email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Picked at: {new Date(order.picked_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Box</TableHead>
                            <TableHead>Wine</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Picked At</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.picked_items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Badge variant="outline">{item.order_number}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">{item.wine_name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>
                                {new Date(item.picked_at).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approved Tab */}
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Orders</CardTitle>
              <CardDescription>
                Orders ready for shipping with tracking numbers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {approvedOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Approved Orders</h3>
                  <p className="text-muted-foreground">
                    No orders have been approved yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedApprovedOrders.length === approvedOrders.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedApprovedOrders(approvedOrders.map(o => o.id));
                          } else {
                            setSelectedApprovedOrders([]);
                              }
                            }}
                      />
                      <Label>Select All</Label>
                    </div>
                    <Button
                      onClick={() => {
                        const trackingNumbers: { [key: string]: string } = {};
                        selectedApprovedOrders.forEach(id => {
                          trackingNumbers[id] = `TRK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
                        });
                        shipOrders(selectedApprovedOrders, trackingNumbers);
                      }}
                      disabled={selectedApprovedOrders.length === 0}
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Ship Selected ({selectedApprovedOrders.length})
                    </Button>
                  </div>

                  {approvedOrders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedApprovedOrders.includes(order.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedApprovedOrders([...selectedApprovedOrders, order.id]);
                              } else {
                                setSelectedApprovedOrders(selectedApprovedOrders.filter(id => id !== order.id));
                              }
                            }}
                          />
                          <div>
                            <h4 className="font-medium">{order.order_number}</h4>
                            <p className="text-sm text-muted-foreground">
                              {order.customer_name} • {order.customer_email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Approved at: {new Date(order.approved_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Box</TableHead>
                            <TableHead>Wine</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Approved At</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.approved_items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Badge variant="outline">{item.order_number}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">{item.wine_name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>
                                {new Date(item.picked_at).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipped Tab */}
        <TabsContent value="shipped">
          <Card>
            <CardHeader>
              <CardTitle>Shipped Orders</CardTitle>
              <CardDescription>
                Orders that have been shipped with tracking information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shippedOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Shipped Orders</h3>
                  <p className="text-muted-foreground">
                    No orders have been shipped yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {shippedOrders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{order.order_number}</h4>
                          <p className="text-sm text-muted-foreground">
                            {order.customer_name} • {order.customer_email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Shipped at: {new Date(order.shipped_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="default" className="mb-2">
                            Tracking: {order.tracking_number}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Shipping Label
                          </Button>
                        </div>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Box</TableHead>
                            <TableHead>Wine</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Tracking</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.shipped_items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Badge variant="outline">{item.order_number}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">{item.wine_name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">{order.tracking_number}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
