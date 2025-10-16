import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
  Wine as WineIcon, 
  Gift, 
  Crown, 
  RotateCcw, 
  Calendar as CalendarIcon,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Clock,
  DollarSign
} from "lucide-react";
import { format, addDays, addWeeks, isAfter, startOfWeek, addDays as addDaysToDate } from "date-fns";
import { api } from "../utils/api";
import { useClient } from "../contexts/ClientContext";

interface Wine {
  id: string;
  name: string;
  description: string;
  price: number;
  category_name: string;
  varietal: string;
  color: string;
  sweetness: string;
  image_url?: string;
  square_item_id: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  subscription_plan: {
    name: string;
    bottle_count: number;
    discount_percentage: number;
  };
}

interface CustomerWineSelectionProps {
  memberId: string;
  onComplete?: () => void;
}

export function CustomerWineSelection({ memberId, onComplete }: CustomerWineSelectionProps) {
  const { currentWineClub } = useClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [member, setMember] = useState<Member | null>(null);
  const [wines, setWines] = useState<Wine[]>([]);
  const [selectedWines, setSelectedWines] = useState<Wine[]>([]);
  const [swapMode, setSwapMode] = useState<'quantity' | 'new'>('quantity');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSweetness, setSelectedSweetness] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Load member and initial wines
  useEffect(() => {
    const loadData = async () => {
      if (!currentWineClub) return;
      
      try {
        setLoading(true);
        
        // Load member data
        const memberRes = await api.getMembers(currentWineClub.id);
        const memberData = memberRes.members.find((m: any) => m.id === memberId);
        if (!memberData) throw new Error('Member not found');
        
        setMember(memberData);
        
        // Load wines based on member preferences
        const inventoryRes = await api.getLiveInventory(currentWineClub.id, 'all', 0);
        const availableWines = inventoryRes.wines || [];
        
        // Filter wines based on member's subscription plan bottle count
        const bottleCount = memberData.subscription_plan?.bottle_count || 3;
        const initialWines = availableWines.slice(0, bottleCount);
        
        setWines(availableWines);
        setSelectedWines(initialWines);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [memberId, currentWineClub]);

  // Get available delivery dates (next Wednesday + 7 days, then 1-2 Wednesdays after)
  const getAvailableDeliveryDates = () => {
    const today = new Date();
    const nextWednesday = addDaysToDate(startOfWeek(today, { weekStartsOn: 1 }), 6); // Next Wednesday
    const minDate = addDays(nextWednesday, 7); // 7 days from next Wednesday
    
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const date = addWeeks(minDate, i);
      if (isAfter(date, today)) {
        dates.push(date);
      }
    }
    return dates;
  };

  const handleWineSwap = (wineIndex: number, newWine: Wine) => {
    const updatedWines = [...selectedWines];
    updatedWines[wineIndex] = newWine;
    setSelectedWines(updatedWines);
  };

  // Remove unused handleQuantityChange function

  const calculateTotal = () => {
    if (!member) return 0;
    const subtotal = selectedWines.reduce((sum, wine) => sum + wine.price, 0);
    const discount = member.subscription_plan?.discount_percentage || 0;
    return subtotal * (1 - discount / 100);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Process payment (placeholder - would integrate with Square)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Move to receipt step
      setCurrentStep(6);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && currentStep === 1) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <WineIcon className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading your wine selection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (!member) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Step 1: Welcome & Initial Selection */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-600" />
              Welcome {member.name}!
            </CardTitle>
            <CardDescription>
              As a {member.subscription_plan?.name} Member, ready to explore your wines for this month?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">{member.subscription_plan?.name} Club</span>
              </div>
              <p className="text-sm text-gray-600">
                {member.subscription_plan?.bottle_count} bottles • {member.subscription_plan?.discount_percentage}% discount
              </p>
            </div>

            <div className="grid gap-3">
              {selectedWines.map((wine, index) => (
                <div key={wine.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <WineIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">{wine.name}</p>
                      <p className="text-sm text-gray-600">{wine.varietal} • {wine.color}</p>
                      <p className="text-sm font-medium">${wine.price}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentStep(2)}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Swap
                  </Button>
                </div>
              ))}
            </div>

            <Button 
              className="w-full" 
              onClick={() => setCurrentStep(2)}
            >
              View Wines
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Swap Options */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Wine Shipment</CardTitle>
            <CardDescription>Do you want two of one wine, or find a new one?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant={swapMode === 'quantity' ? 'default' : 'outline'}
                onClick={() => setSwapMode('quantity')}
                className="h-20 flex flex-col gap-2"
              >
                <Gift className="w-6 h-6" />
                Give me 2 of one
              </Button>
              <Button 
                variant={swapMode === 'new' ? 'default' : 'outline'}
                onClick={() => setSwapMode('new')}
                className="h-20 flex flex-col gap-2"
              >
                <WineIcon className="w-6 h-6" />
                Find a new one
              </Button>
            </div>

            {swapMode === 'new' && (
              <div className="space-y-4">
                <div>
                  <Label>Pick a color</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button 
                      variant={selectedColor === 'Red' ? 'default' : 'outline'}
                      onClick={() => setSelectedColor('Red')}
                    >
                      Red
                    </Button>
                    <Button 
                      variant={selectedColor === 'White' ? 'default' : 'outline'}
                      onClick={() => setSelectedColor('White')}
                    >
                      White
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Pick a sweetness</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Button 
                      variant={selectedSweetness === 'Dry' ? 'default' : 'outline'}
                      onClick={() => setSelectedSweetness('Dry')}
                    >
                      Dry
                    </Button>
                    <Button 
                      variant={selectedSweetness === 'Semi-Sweet' ? 'default' : 'outline'}
                      onClick={() => setSelectedSweetness('Semi-Sweet')}
                    >
                      Semi-Sweet
                    </Button>
                    <Button 
                      variant={selectedSweetness === 'Sweet' ? 'default' : 'outline'}
                      onClick={() => setSelectedSweetness('Sweet')}
                    >
                      Sweet
                    </Button>
                  </div>
                </div>

                {/* Show filtered wines */}
                <div className="space-y-2">
                  <Label>Available wines matching your preferences:</Label>
                  {wines
                    .filter(wine => 
                      (!selectedColor || wine.color === selectedColor) &&
                      (!selectedSweetness || wine.sweetness === selectedSweetness)
                    )
                    .slice(0, 5)
                    .map(wine => (
                      <div key={wine.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{wine.name}</p>
                          <p className="text-sm text-gray-600">{wine.varietal} • ${wine.price}</p>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => {
                            // Replace first wine with selected one
                            handleWineSwap(0, wine);
                            setCurrentStep(3);
                          }}
                        >
                          Select
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Pick Delivery Date */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Delivery Date</CardTitle>
            <CardDescription>Select when you'd like your wines delivered:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              {getAvailableDeliveryDates().map(date => (
                <Button
                  key={date.toISOString()}
                  variant={deliveryDate?.toDateString() === date.toDateString() ? 'default' : 'outline'}
                  onClick={() => setDeliveryDate(date)}
                  className="justify-start h-auto p-4"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <p className="font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</p>
                    <p className="text-sm opacity-70">Wednesday delivery</p>
                  </div>
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep(4)}
                disabled={!deliveryDate}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Payment Information */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>Update your payment method for this order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentInfo.cardNumber}
                onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentInfo.expiryDate}
                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentInfo.cvv}
                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={paymentInfo.name}
                onChange={(e) => setPaymentInfo(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep(5)}
                disabled={!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.name}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Order Summary & Confirmation */}
      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your order before confirming</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {selectedWines.map((wine, index) => (
                <div key={wine.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <WineIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">{wine.name}</p>
                      <p className="text-sm text-gray-600">{wine.varietal} • {wine.color}</p>
                    </div>
                  </div>
                  <p className="font-medium">${wine.price}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${selectedWines.reduce((sum, wine) => sum + wine.price, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Club Discount ({member.subscription_plan?.discount_percentage}%):</span>
                <span className="text-green-600">
                  -${(selectedWines.reduce((sum, wine) => sum + wine.price, 0) * (member.subscription_plan?.discount_percentage || 0) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Delivery Date</span>
              </div>
              <p className="text-sm text-gray-600">
                {deliveryDate ? format(deliveryDate, 'EEEE, MMMM d, yyyy') : 'Not selected'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(4)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Confirm & Pay ${calculateTotal().toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 6: Receipt */}
      {currentStep === 6 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Order Confirmed!
            </CardTitle>
            <CardDescription>Your wine selections and delivery date have been saved.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Payment Successful</span>
              </div>
              <p className="text-sm text-green-700">
                You have been charged ${calculateTotal().toFixed(2)} for your wine selection.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Order Details:</h4>
              {selectedWines.map((wine, index) => (
                <div key={wine.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{wine.name}</span>
                  <span>${wine.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total Paid:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Expected Delivery</span>
              </div>
              <p className="text-sm text-gray-600">
                {deliveryDate ? format(deliveryDate, 'EEEE, MMMM d, yyyy') : 'Not selected'}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                This demo is complete. In the live version, your order would be processed.
              </p>
              <Button onClick={onComplete} className="w-full">
                Complete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
