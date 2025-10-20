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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
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
  Download,
  Upload,
  Mail,
  FileText
} from "lucide-react";
import { api } from "../utils/api";
import { useClient } from "../contexts/ClientContext";

interface SquareOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  zip: string;
  order_date: string;
  total_amount: number;
  amount_paid: number;
  date_paid: string;
  wine_club_plan: string;
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
  status: 'pending' | 'picked' | 'out_of_stock' | 'removed';
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
  const [editingOrder, setEditingOrder] = useState<SquareOrder | null>(null);
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false);
  
  // Picked Tab
  const [pickedOrders, setPickedOrders] = useState<PickedOrder[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  // Approved Tab
  const [approvedOrders, setApprovedOrders] = useState<ApprovedOrder[]>([]);
  const [selectedApprovedOrders, setSelectedApprovedOrders] = useState<string[]>([]);
  
  // Shipped Tab
  const [shippedOrders, setShippedOrders] = useState<ShippedOrder[]>([]);

  // CSV Export functionality
  const [csvEmail, setCsvEmail] = useState("");
  const [saveEmail, setSaveEmail] = useState(false);
  const [isCsvDialogOpen, setIsCsvDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [trackingFile, setTrackingFile] = useState<File | null>(null);
  const [csvExportLoading, setCsvExportLoading] = useState(false);
  const [trackingUploadLoading, setTrackingUploadLoading] = useState(false);

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
          customer_phone: "+1-555-0123",
          address_line_1: "123 Main Street",
          address_line_2: "Apt 4B",
          city: "San Francisco",
          state: "CA",
          zip: "94102",
          order_date: "2025-01-15",
          total_amount: 89.00,
          amount_paid: 89.00,
          date_paid: "2025-01-15",
          wine_club_plan: "Gold",
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
              in_stock: true,
              status: 'pending'
            }
          ],
          created_at: "2025-01-15T10:00:00Z"
        },
        {
          id: "order_2",
          order_number: "ORD-002",
          customer_name: "Sarah Johnson",
          customer_email: "sarah@example.com",
          customer_phone: "+1-555-0124",
          address_line_1: "456 Oak Avenue",
          address_line_2: "",
          city: "Los Angeles",
          state: "CA",
          zip: "90210",
          order_date: "2025-01-16",
          total_amount: 178.00,
          amount_paid: 178.00,
          date_paid: "2025-01-16",
          wine_club_plan: "Silver",
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
              in_stock: true,
              status: 'pending'
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

  // Action functions for order management
  const markItemAsPicked = (orderId: string, itemId: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          line_items: order.line_items.map(item => 
            item.id === itemId ? { ...item, status: 'picked' as const } : item
          )
        };
      }
      return order;
    }));
  };

  const markItemAsOutOfStock = (orderId: string, itemId: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          line_items: order.line_items.map(item => 
            item.id === itemId ? { ...item, status: 'out_of_stock' as const } : item
          )
        };
      }
      return order;
    }));
  };

  const removeItem = (orderId: string, itemId: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          line_items: order.line_items.map(item => 
            item.id === itemId ? { ...item, status: 'removed' as const } : item
          )
        };
      }
      return order;
    }));
  };

  const isOrderReadyToShip = (order: SquareOrder) => {
    const activeItems = order.line_items.filter(item => item.status !== 'removed');
    return activeItems.length > 0 && activeItems.every(item => item.status === 'picked');
  };

  const markOrderAsReadyToShip = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || !isOrderReadyToShip(order)) return;

    // Group items by wine and create box numbers
    const pickedItems: PickedItem[] = [];
    let boxNumber = 1;
    
    order.line_items
      .filter(item => item.status === 'picked')
      .forEach(item => {
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

  const openModifyOrderDialog = (order: SquareOrder) => {
    setEditingOrder({ ...order });
    setIsModifyDialogOpen(true);
  };

  const saveModifiedOrder = () => {
    if (!editingOrder) return;

    // Calculate new total with plan discount
    const planDiscounts = {
      'Gold': 0.20,
      'Silver': 0.15,
      'Platinum': 0.25
    };
    
    const discount = planDiscounts[editingOrder.wine_club_plan as keyof typeof planDiscounts] || 0;
    const subtotal = editingOrder.line_items.reduce((sum, item) => sum + (item.total_price), 0);
    const discountAmount = subtotal * discount;
    const newTotal = subtotal - discountAmount;

    const updatedOrder = {
      ...editingOrder,
      total_amount: newTotal,
      amount_paid: editingOrder.amount_paid // Original amount paid
    };

    setOrders(orders.map(order => order.id === editingOrder.id ? updatedOrder : order));
    setIsModifyDialogOpen(false);
    setEditingOrder(null);
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

  const generateCsvData = () => {
    const csvData = shippedOrders.map(order => ({
      'Order Number': order.order_number,
      'Customer Name': order.customer_name,
      'Customer Email': order.customer_email,
      'Tracking Number': order.tracking_number,
      'Shipped Date': new Date(order.shipped_at).toLocaleDateString(),
      'Total Items': order.shipped_items.length,
      'Items': order.shipped_items.map(item => `${item.wine_name} (${item.quantity})`).join('; ')
    }));
    
    return csvData;
  };

  const exportCsv = async () => {
    if (!csvEmail) {
      alert('Please enter an email address');
      return;
    }

    try {
      setCsvExportLoading(true);
      
      const csvData = generateCsvData();
      const csvContent = [
        // CSV Header
        Object.keys(csvData[0] || {}).join(','),
        // CSV Rows
        ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');

      // Create and download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fulfillment-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Send email with CSV (this would call your email service)
      await api.sendFulfillmentCsv(csvEmail, csvContent, saveEmail);
      
      setIsCsvDialogOpen(false);
      alert('CSV exported and email sent successfully!');
      
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting CSV. Please try again.');
    } finally {
      setCsvExportLoading(false);
    }
  };

  const handleTrackingFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setTrackingFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const uploadTrackingCsv = async () => {
    if (!trackingFile) {
      alert('Please select a CSV file');
      return;
    }

    try {
      setTrackingUploadLoading(true);
      
      const text = await trackingFile.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      // Expected headers: Order Number, Tracking Number
      const orderNumberIndex = headers.findIndex(h => h.toLowerCase().includes('order'));
      const trackingNumberIndex = headers.findIndex(h => h.toLowerCase().includes('tracking'));
      
      if (orderNumberIndex === -1 || trackingNumberIndex === -1) {
        alert('CSV must contain "Order Number" and "Tracking Number" columns');
        return;
      }

      const trackingUpdates: { [orderNumber: string]: string } = {};
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        if (values[orderNumberIndex] && values[trackingNumberIndex]) {
          trackingUpdates[values[orderNumberIndex]] = values[trackingNumberIndex];
        }
      }

      // Update shipped orders with tracking numbers
      const updatedShippedOrders = shippedOrders.map(order => {
        const trackingNumber = trackingUpdates[order.order_number];
        if (trackingNumber) {
          return {
            ...order,
            tracking_number: trackingNumber,
            shipped_at: new Date().toISOString()
          };
        }
        return order;
      });

      setShippedOrders(updatedShippedOrders);
      
      // Update Square orders with tracking numbers
      await api.updateSquareOrderTracking(trackingUpdates);
      
      setIsUploadDialogOpen(false);
      setTrackingFile(null);
      alert('Tracking numbers updated successfully!');
      
    } catch (error) {
      console.error('Error uploading tracking CSV:', error);
      alert('Error uploading tracking CSV. Please try again.');
    } finally {
      setTrackingUploadLoading(false);
    }
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
          
          {/* CSV Export Dialog */}
          <Dialog open={isCsvDialogOpen} onOpenChange={setIsCsvDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Send CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Fulfillment CSV</DialogTitle>
                <DialogDescription>
                  Export shipped orders to CSV and send via email
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-email">Email Address</Label>
                  <Input
                    id="csv-email"
                    type="email"
                    placeholder="recipient@example.com"
                    value={csvEmail}
                    onChange={(e) => setCsvEmail(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={saveEmail}
                    onCheckedChange={setSaveEmail}
                  />
                  <Label>Save email for future exports</Label>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>CSV will include:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Order Number</li>
                    <li>Customer Name & Email</li>
                    <li>Tracking Number</li>
                    <li>Shipped Date</li>
                    <li>Item Details</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCsvDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={exportCsv} disabled={csvExportLoading || !csvEmail}>
                  {csvExportLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send CSV
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Upload Tracking Dialog */}
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Tracking
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Tracking Numbers</DialogTitle>
                <DialogDescription>
                  Upload CSV file with tracking numbers to update Square orders
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tracking-file">CSV File</Label>
                  <Input
                    id="tracking-file"
                    type="file"
                    accept=".csv"
                    onChange={handleTrackingFileUpload}
                  />
                  {trackingFile && (
                    <p className="text-sm text-green-600 mt-1">
                      Selected: {trackingFile.name}
                    </p>
                  )}
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    CSV must contain columns: "Order Number" and "Tracking Number"
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={uploadTrackingCsv} 
                  disabled={trackingUploadLoading || !trackingFile}
                >
                  {trackingUploadLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Tracking
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
                <div className="space-y-6">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-6">
                      {/* Order Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <h4 className="text-lg font-semibold">{order.order_number}</h4>
                            <Badge variant="outline">{order.wine_club_plan}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">{order.customer_name}</p>
                              <p className="text-muted-foreground">{order.customer_email}</p>
                              <p className="text-muted-foreground">{order.customer_phone}</p>
                            </div>
                            <div>
                              <p className="font-medium">Address:</p>
                              <p className="text-muted-foreground">{order.address_line_1}</p>
                              {order.address_line_2 && (
                                <p className="text-muted-foreground">{order.address_line_2}</p>
                              )}
                              <p className="text-muted-foreground">
                                {order.city}, {order.state} {order.zip}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div>
                              <span className="font-medium">Order Date:</span> {new Date(order.order_date).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Date Paid:</span> {new Date(order.date_paid).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Amount Paid:</span> ${order.amount_paid}
                            </div>
                            <div>
                              <span className="font-medium">Order Total:</span> ${order.total_amount}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant={isOrderReadyToShip(order) ? "default" : "outline"}
                            size="sm"
                            onClick={() => markOrderAsReadyToShip(order.id)}
                            disabled={!isOrderReadyToShip(order)}
                            className={isOrderReadyToShip(order) ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Ready to Ship
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModifyOrderDialog(order)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Modify Order
                          </Button>
                        </div>
                      </div>
                      
                      {/* Line Items Table */}
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Wine</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.line_items.map((item) => (
                            <TableRow key={item.id} className={item.status === 'removed' ? 'opacity-50' : ''}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.category}</Badge>
                              </TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>${item.unit_price}</TableCell>
                              <TableCell>${item.total_price}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    item.status === 'picked' ? 'default' : 
                                    item.status === 'out_of_stock' ? 'destructive' : 
                                    item.status === 'removed' ? 'secondary' : 'outline'
                                  }
                                  className={
                                    item.status === 'picked' ? 'bg-green-600 hover:bg-green-700' : 
                                    item.status === 'out_of_stock' ? 'bg-red-600 hover:bg-red-700' : ''
                                  }
                                >
                                  {item.status === 'picked' ? 'Picked' :
                                   item.status === 'out_of_stock' ? 'Out of Stock' :
                                   item.status === 'removed' ? 'Removed' : 'Pending'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => markItemAsPicked(order.id, item.id)}
                                    disabled={item.status === 'picked' || item.status === 'removed'}
                                    className={item.status === 'picked' ? 'bg-green-100 border-green-300' : ''}
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Picked
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => markItemAsOutOfStock(order.id, item.id)}
                                    disabled={item.status === 'out_of_stock' || item.status === 'removed'}
                                    className={item.status === 'out_of_stock' ? 'bg-red-100 border-red-300' : ''}
                                  >
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Out of Stock
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={item.status === 'removed'}
                                        className={item.status === 'removed' ? 'bg-gray-100 border-gray-300' : ''}
                                      >
                                        <Minus className="h-3 w-3 mr-1" />
                                        Remove
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Remove Item</DialogTitle>
                                        <DialogDescription>
                                          Are you sure you want to remove "{item.name}" from this order?
                                          This action cannot be undone.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter>
                                        <Button variant="outline">Cancel</Button>
                                        <Button 
                                          variant="destructive"
                                          onClick={() => removeItem(order.id, item.id)}
                                        >
                                          Remove Item
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
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

      {/* Modify Order Dialog */}
      <Dialog open={isModifyDialogOpen} onOpenChange={setIsModifyDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modify Order - {editingOrder?.order_number}</DialogTitle>
            <DialogDescription>
              Edit quantities, add/remove wines, and recalculate pricing with plan discounts
            </DialogDescription>
          </DialogHeader>
          
          {editingOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <p className="text-sm">{editingOrder.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{editingOrder.customer_email}</p>
                  <p className="text-sm text-muted-foreground">{editingOrder.customer_phone}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Plan & Payment</h4>
                  <p className="text-sm">Plan: {editingOrder.wine_club_plan}</p>
                  <p className="text-sm text-muted-foreground">Amount Paid: ${editingOrder.amount_paid}</p>
                  <p className="text-sm text-muted-foreground">Date Paid: {new Date(editingOrder.date_paid).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Editable Line Items */}
              <div>
                <h4 className="font-medium mb-3">Line Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wine</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editingOrder.line_items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newItems = [...editingOrder.line_items];
                                if (newItems[index].quantity > 1) {
                                  newItems[index].quantity -= 1;
                                  newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
                                  setEditingOrder({ ...editingOrder, line_items: newItems });
                                }
                              }}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newItems = [...editingOrder.line_items];
                                newItems[index].quantity += 1;
                                newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
                                setEditingOrder({ ...editingOrder, line_items: newItems });
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>${item.unit_price}</TableCell>
                        <TableCell>${item.total_price}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newItems = editingOrder.line_items.filter((_, i) => i !== index);
                              setEditingOrder({ ...editingOrder, line_items: newItems });
                            }}
                          >
                            <Minus className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Add Wine Section */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Add New Wine</h4>
                <div className="flex space-x-2">
                  <Select>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select wine to add..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wine_3">Pinot Noir 2022 - $32.00</SelectItem>
                      <SelectItem value="wine_4">Merlot 2021 - $28.00</SelectItem>
                      <SelectItem value="wine_5">Sauvignon Blanc 2023 - $26.00</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Add new wine logic here
                      const newItem = {
                        id: `item_${Date.now()}`,
                        name: "Pinot Noir 2022",
                        quantity: 1,
                        unit_price: 32.00,
                        total_price: 32.00,
                        item_id: "wine_3",
                        variation_id: "var_3",
                        category: "Red Wine",
                        in_stock: true,
                        status: 'pending' as const
                      };
                      setEditingOrder({
                        ...editingOrder,
                        line_items: [...editingOrder.line_items, newItem]
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Wine
                  </Button>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Pricing Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${editingOrder.line_items.reduce((sum, item) => sum + item.total_price, 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan Discount ({editingOrder.wine_club_plan}):</span>
                    <span className="text-green-600">
                      -${(editingOrder.line_items.reduce((sum, item) => sum + item.total_price, 0) * 
                        (editingOrder.wine_club_plan === 'Gold' ? 0.20 : 
                         editingOrder.wine_club_plan === 'Silver' ? 0.15 : 
                         editingOrder.wine_club_plan === 'Platinum' ? 0.25 : 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium text-lg border-t pt-2">
                    <span>New Total:</span>
                    <span>
                      ${(editingOrder.line_items.reduce((sum, item) => sum + item.total_price, 0) * 
                        (1 - (editingOrder.wine_club_plan === 'Gold' ? 0.20 : 
                               editingOrder.wine_club_plan === 'Silver' ? 0.15 : 
                               editingOrder.wine_club_plan === 'Platinum' ? 0.25 : 0))).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Original Amount Paid:</span>
                    <span>${editingOrder.amount_paid}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Refund/Additional Charge:</span>
                    <span className={
                      (editingOrder.line_items.reduce((sum, item) => sum + item.total_price, 0) * 
                       (1 - (editingOrder.wine_club_plan === 'Gold' ? 0.20 : 
                              editingOrder.wine_club_plan === 'Silver' ? 0.15 : 
                              editingOrder.wine_club_plan === 'Platinum' ? 0.25 : 0))) - editingOrder.amount_paid > 0 
                        ? 'text-red-600' : 'text-green-600'
                    }>
                      {((editingOrder.line_items.reduce((sum, item) => sum + item.total_price, 0) * 
                         (1 - (editingOrder.wine_club_plan === 'Gold' ? 0.20 : 
                                editingOrder.wine_club_plan === 'Silver' ? 0.15 : 
                                editingOrder.wine_club_plan === 'Platinum' ? 0.25 : 0))) - editingOrder.amount_paid) > 0 
                        ? '+' : ''}
                      ${((editingOrder.line_items.reduce((sum, item) => sum + item.total_price, 0) * 
                          (1 - (editingOrder.wine_club_plan === 'Gold' ? 0.20 : 
                                 editingOrder.wine_club_plan === 'Silver' ? 0.15 : 
                                 editingOrder.wine_club_plan === 'Platinum' ? 0.25 : 0))) - editingOrder.amount_paid).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveModifiedOrder}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
