import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  Lock,
  AlertTriangle,
  ArrowRight
} from "lucide-react";

interface PaymentCollectionProps {
  memberName: string;
  shipmentTotal: number;
  discount: number;
  onPaymentSaved: (paymentMethodId: string) => void;
  onSkip?: () => void;
  isLoading?: boolean;
}

export function PaymentCollection({ 
  memberName, 
  shipmentTotal, 
  discount, 
  onPaymentSaved, 
  onSkip, 
  isLoading 
}: PaymentCollectionProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState(memberName);
  const [billingZip, setBillingZip] = useState("");
  const [saveForFuture, setSaveForFuture] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const discountAmount = (shipmentTotal * discount) / 100;
  const finalTotal = shipmentTotal - discountAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate Square Payment Form processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment method creation
      const mockPaymentMethodId = `card_${Date.now()}`;
      onPaymentSaved(mockPaymentMethodId);
    } catch (error) {
      console.error('Payment processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-serif text-gray-900 mb-2">Secure Payment Setup</h1>
          <p className="text-gray-600">
            We've upgraded to Square for secure payments. Please save your card once for future shipments.
          </p>
        </div>

        {/* Security Notice */}
        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Secure & Encrypted:</strong> Your payment information is processed securely by Square
            and never stored on our servers. Industry-standard encryption protects all transactions.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  Your card will be securely saved for future wine club shipments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          type="text"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="text"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name-on-card">Name on Card</Label>
                      <Input
                        id="name-on-card"
                        type="text"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billing-zip">Billing ZIP Code</Label>
                      <Input
                        id="billing-zip"
                        type="text"
                        placeholder="12345"
                        value={billingZip}
                        onChange={(e) => setBillingZip(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="save-card"
                      checked={saveForFuture}
                      onChange={(e) => setSaveForFuture(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="save-card" className="text-sm">
                      Save this card for future wine club shipments
                    </Label>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={isProcessing || isLoading}
                    >
                      {isProcessing ? (
                        "Processing..."
                      ) : (
                        <>
                          Save Payment Method & Continue
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>

                    {onSkip && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="w-full"
                        onClick={onSkip}
                        disabled={isProcessing}
                      >
                        Skip for now (you'll be prompted again next shipment)
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Shipment Total</span>
                    <span>${shipmentTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Member Discount ({discount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Badge variant="secondary" className="w-full justify-center">
                  One-time setup • Future shipments are automatic
                </Badge>

                <div className="text-sm text-muted-foreground space-y-2">
                  <p>✓ Secure payment processing by Square</p>
                  <p>✓ Card details encrypted and protected</p>
                  <p>✓ Easy management of future shipments</p>
                  <p>✓ Cancel or modify anytime</p>
                </div>
              </CardContent>
            </Card>

            {/* Benefits Card */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Why save your card?</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Future wine shipments will be seamless - just approve your selection 
                      and we'll handle the rest automatically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}